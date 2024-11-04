"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ZoomIn, ZoomOut, Send, Edit, Highlighter, MessageSquare, Save } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

interface Annotation {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'highlight' | 'comment';
  content?: string;
  pageNumber: number;
}

export default function ResumeSubmitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editType, setEditType] = useState<'highlight' | 'comment'>('highlight');
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const adjustScale = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth - 32; // 패딩 고려
      setScale(containerWidth / 600); // 기본 PDF 너비를 600px로 가정
    }
  }, []);

  useEffect(() => {
    adjustScale();
    window.addEventListener('resize', adjustScale);
    return () => window.removeEventListener('resize', adjustScale);
  }, [adjustScale]);

  const onFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setAnnotations([]);
    
    try {
      if (!file.type.includes('pdf')) {
        throw new Error('PDF 파일만 업로드 가능합니다.');
      }

      setFile(file);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('PDF 파일을 로드하는데 실패했습니다. 다른 파일을 시도해주세요.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    adjustScale();
  }, [adjustScale]);

  const handleZoom = useCallback((delta: number) => {
    setScale(prevScale => Math.max(0.5, Math.min(3, prevScale + delta)));
  }, []);

  const handlePreviousPage = useCallback(() => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  }, [numPages]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEditMode) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    setAnnotations(prevAnnotations => [
      ...prevAnnotations,
      { x, y, width: 0, height: 0, type: editType, pageNumber }
    ]);
  }, [isEditMode, editType, scale, pageNumber]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isEditMode) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    setAnnotations(prevAnnotations => {
      const newAnnotations = [...prevAnnotations];
      const currentAnnotation = newAnnotations[newAnnotations.length - 1];
      currentAnnotation.width = x - currentAnnotation.x;
      currentAnnotation.height = y - currentAnnotation.y;
      return newAnnotations;
    });
  }, [isDrawing, isEditMode, scale]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
    if (editType === 'comment') {
      const content = prompt('댓글을 입력하세요:');
      if (content) {
        setAnnotations(prevAnnotations => {
          const newAnnotations = [...prevAnnotations];
          const currentAnnotation = newAnnotations[newAnnotations.length - 1];
          currentAnnotation.content = content;
          return newAnnotations;
        });
      }
    }
  }, [editType]);

  const drawAnnotations = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    annotations.forEach(annotation => {
      if (annotation.pageNumber === pageNumber) {
        if (annotation.type === 'highlight') {
          ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
          ctx.fillRect(
            annotation.x * scale,
            annotation.y * scale,
            annotation.width * scale,
            annotation.height * scale
          );
        } else if (annotation.type === 'comment') {
          ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
          ctx.fillRect(
            annotation.x * scale,
            annotation.y * scale,
            annotation.width * scale,
            annotation.height * scale
          );
          ctx.fillStyle = 'red';
          ctx.font = '12px Arial';
          ctx.fillText(
            annotation.content || '',
            annotation.x * scale,
            (annotation.y + annotation.height) * scale + 15
          );
        }
      }
    });
  }, [annotations, pageNumber, scale]);

  useEffect(() => {
    drawAnnotations();
  }, [drawAnnotations]);

  const toggleEditMode = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditMode(prev => !prev);
  }, []);

  const handleSave = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Annotations:', annotations);
    alert('편집 내용이 저장되었습니다.');
  }, [annotations]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('이력서 파일을 선택해주세요.');
      return;
    }
    setLoading(true);
    console.log('이력서 제출:', { file, coverLetter, annotations });
    setLoading(false);
    alert('이력서가 성공적으로 제출되었습니다!');
  }, [file, coverLetter, annotations]);

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">이력서 제출</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="pdf-upload">PDF 이력서 선택</Label>
                <Input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={onFileChange}
                  className="mt-2"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loading && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}

              {file && !loading && (
                <div className="border rounded-lg overflow-hidden" ref={containerRef}>
                  <div className="relative" style={{ height: '60vh' }}>
                    <Document
                      file={URL.createObjectURL(file)}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={(err) => {
                        console.error('Error loading document:', err);
                        setError('문서를 로드하는데 실패했습니다.');
                      }}
                      loading={
                        <div className="flex items-center justify-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      }
                    >
                      <div className="absolute inset-0 overflow-auto">
                        {numPages && pageNumber <= numPages && (
                          <div style={{ position: 'relative' }}>
                            <Page
                              key={`page_${pageNumber}`}
                              pageNumber={pageNumber}
                              scale={scale}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              loading={
                                <div className="flex items-center justify-center p-8">
                                  <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                              }
                            />
                            <canvas
                              ref={canvasRef}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                pointerEvents: isEditMode ? 'auto' : 'none',
                              }}
                              onMouseDown={handleMouseDown}
                              onMouseMove={handleMouseMove}
                              onMouseUp={handleMouseUp}
                            />
                          </div>
                        )}
                      </div>
                    </Document>
                  </div>

                  <div className="sticky bottom-0 bg-background border-t p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={(e) => { e.preventDefault(); handleZoom(0.1); }}
                          aria-label="확대"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={(e) => { e.preventDefault(); handleZoom(-0.1); }}
                          aria-label="축소"
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant={isEditMode ? "secondary" : "outline"}
                          onClick={toggleEditMode}
                          aria-label="편집 모드"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {isEditMode && (
                          <>
                            <Button
                              size="icon"
                              variant={editType === 'highlight' ? "secondary" : "outline"}
                              onClick={(e) => { e.preventDefault(); setEditType('highlight'); }}
                              aria-label="하이라이트"
                            >
                              <Highlighter className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant={editType === 'comment' ? "secondary" : "outline"}
                              onClick={(e) => { e.preventDefault(); setEditType('comment'); }}
                              aria-label="댓글"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={handleSave}
                          aria-label="저장"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={(e) => { e.preventDefault(); handlePreviousPage(); }}
                          disabled={pageNumber <= 1}
                        >
                          이전
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {pageNumber} / {numPages}
                        </span>
                        <Button
                          onClick={(e) => { e.preventDefault(); handleNextPage(); }}
                          disabled={pageNumber >= (numPages || 1)}
                        >
                          다음
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="cover-letter">자기소개서</Label>
                <Textarea
                  id="cover-letter"
                  placeholder="자기소개서를 입력해주세요."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  className="mt-2"
                />
              
              </div>

              <Button type="submit" className="w-full" disabled={!file || loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    제출 중...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    이력서 제출
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}