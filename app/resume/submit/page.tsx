"use client";

import React, { useState, useRef, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import * as PDFJS from "pdfjs-dist/types/src/pdf";

//TODO pdfjs-dist/webpack.mjs 파일 추가
declare module 'pdfjs-dist/webpack' { export * from 'pdfjs-dist' }

export const usePDFJS = (onLoad: (pdfjs: typeof PDFJS) => Promise<void>, deps: (string | number | boolean | undefined | null)[] = []) => {
  
  const [pdfjs, setPDFJS] = useState<typeof PDFJS>(null);
  
  // load the library once on mount (the webpack import automatically sets-up the worker)
  useEffect(() => {
    import("pdfjs-dist/webpack").then(setPDFJS)
  }, []);

  // execute the callback function whenever PDFJS loads (or a custom dependency-array updates)
  useEffect(() => {
    if(!pdfjs) return;
    (async () => await onLoad(pdfjs))();
  }, [ pdfjs, ...deps ]);
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ZoomIn, ZoomOut } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.mjs';

const EXPRESS_SERVER_URL = 'http://localhost:8080';

export default function ResumeSubmission() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>(`${EXPRESS_SERVER_URL}/public/sample.pdf`);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [masks, setMasks] = useState<{ x: number; y: number; width: number; height: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const downloadWorker = async () => {
      try {
        const response = await fetch(
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
        );
        const workerBlob = await response.blob();
        const workerUrl = URL.createObjectURL(workerBlob);
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      } catch (error) {
        console.error('PDF.js 워커 로드 실패:', error);
      }
    };

    downloadWorker();
  }, []);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      setFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
      try {
        const pdf = await pdfjs.getDocument(fileUrl).promise;
        setNumPages(pdf.numPages);
      } catch (error) {
        console.error('PDF 로드 실패:', error);
        alert('PDF 파일을 로드하는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const startX = (event.clientX - rect.left) / scale;
    const startY = (event.clientY - rect.top) / scale;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const endX = (moveEvent.clientX - rect.left) / scale;
      const endY = (moveEvent.clientY - rect.top) / scale;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(startX, startY, endX - startX, endY - startY);
      }
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      const endX = (upEvent.clientX - rect.left) / scale;
      const endY = (upEvent.clientY - rect.top) / scale;

      setMasks([...masks, {
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY)
      }]);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('masks', JSON.stringify(masks));

    try {
      console.log('제출된 파일:', file.name);
      console.log('마스크 정보:', masks);
      alert('이력서가 성공적으로 제출되었습니다! (테스트용 메시지)');
    } catch (error) {
      console.error('제출 오류:', error);
      alert('이력서 제출 중 오류가 발생했습니다. (테스트용 메시지)');
    }
  };

  const handleZoom = (delta: number) => {
    setScale(prevScale => Math.max(0.5, Math.min(3, prevScale + delta)));
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">이력서 제출</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="resume">이력서 PDF 파일</Label>
              <Input 
                id="resume" 
                type="file" 
                accept=".pdf" 
                onChange={onFileChange}
              />
            </div>
            
            {loading && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}

            {pdfUrl && !loading && (
              <div className="border p-4 rounded relative">
                <Document 
                  file={pdfUrl} 
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    canvasRef={canvasRef}
                  />
                </Document>
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                />
                <div className="absolute top-2 right-2 space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleZoom(0.1)}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleZoom(-0.1)}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2">
                  페이지 {pageNumber} / {numPages}
                </p>
                <div className="flex justify-between mt-2">
                  <Button
                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1}
                  >
                    이전
                  </Button>
                  <Button
                    onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))}
                    disabled={pageNumber >= (numPages || 1)}
                  >
                    다음
                  </Button>
                </div>
              </div>
            )}
            <Button type="submit" disabled={!file}>이력서 제출</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}