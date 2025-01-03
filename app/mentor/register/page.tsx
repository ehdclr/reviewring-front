"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, Camera } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
interface PricingInfo {
  basePrice: number;
  currency: string;
  description: string;
  videoCallPrice: number;
  onlineReviewPrice: number;
}

interface PricingInfo {
  basePrice: number;
  currency: string;
  description: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface FormData {
  name: string;
  bio: string;
  category: string;
  image: File | null;
  pricing: PricingInfo;
  availableForVideoCall: boolean;
  availableForOnlineReview: boolean;
  videoCallAvailability: string[];
  email: string;
  tags: string[];
  currentTag: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  showEmail: boolean;
  showTags: boolean;
  showExperiences: boolean;
  showEducation: boolean;
  showSkills: boolean;
}

const categories = [
  "IT/개발",
  "디자인",
  "마케팅",
  "경영/비즈니스",
  "금융",
  "교육",
  "의료/건강",
  "법률",
  "예술/엔터테인먼트",
  "기타",
];

const skillOptions = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "UI/UX Design",
  "Digital Marketing",
  "Data Analysis",
  "Project Management",
];

export default function RegisterMentor() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    bio: "",
    category: "",
    image: null,
    pricing: {
      basePrice: 0,
      currency: "KRW",
      description: "",
      videoCallPrice: 0,
      onlineReviewPrice: 0,
    },
    availableForVideoCall: false,
    availableForOnlineReview: false,
    videoCallAvailability: [],
    email: "",
    tags: [],
    currentTag: "",
    experiences: [],
    education: [],
    skills: [],
    showEmail: false,
    showTags: false,
    showExperiences: false,
    showEducation: false,
    showSkills: false,
  });

  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof PricingInfo) => {
    setFormData({
      ...formData,
      pricing: {
        ...formData.pricing,
        [field]: e.target.value,
      },
    });
  };

  const handleChange = <T extends keyof FormData>(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: T,
    index?: number
  ) => {
    if (index !== undefined && Array.isArray(formData[field])) {
      const newArray = [...(formData[field] as any[])];
      newArray[index] = { ...newArray[index], [e.target.name]: e.target.value };
      setFormData({ ...formData, [field]: newArray });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleAddTag = () => {
    if (formData.currentTag && !formData.tags.includes(formData.currentTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.currentTag],
        currentTag: "",
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleAddExperience = () => {
    setFormData({
      ...formData,
      experiences: [
        ...formData.experiences,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
          current: false,
        },
      ],
    });
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = formData.experiences.filter((_, i) => i !== index);
    setFormData({ ...formData, experiences: newExperiences });
  };

  const handleAddEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { school: "", degree: "", field: "", startDate: "", endDate: "" },
      ],
    });
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: newEducation });
  };

  const handleToggleSkill = (skill: string) => {
    const updatedSkills = formData.skills.includes(skill)
      ? formData.skills.filter((s) => s !== skill)
      : [...formData.skills, skill];
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("멘토 등록이 완료되었습니다!");
    } catch (error) {
      console.error("Form submission error:", error);
      alert("멘토 등록 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const toggleSection = (
    section: keyof Pick<
      FormData,
      | "showEmail"
      | "showTags"
      | "showExperiences"
      | "showEducation"
      | "showSkills"
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            멘토 등록
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            * 표시된 항목은 필수 입력 사항입니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-40 h-40 mb-4">
                {formData.image ? (
                  <Image
                    src={URL.createObjectURL(formData.image)}
                    alt="Profile preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 cursor-pointer"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full hover:bg-primary/90">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">프로필 이미지 업로드</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange(e, "name")}
                  required
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">카테고리 *</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">자기 소개 *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange(e, "bio")}
                  rows={5}
                  required
                  placeholder="멘토링 스타일과 경험을 소개해주세요"
                />
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">멘토링 서비스 설정 *</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="availableForVideoCall"
                      checked={formData.availableForVideoCall}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, availableForVideoCall: checked })
                      }
                    />
                    <Label htmlFor="availableForVideoCall">멘토링 제공</Label>
                  </div>
                  {formData.availableForVideoCall && (
                    <div className="pl-6 space-y-2">
                      <Label htmlFor="videoCallPrice">멘토링 가격</Label>
                      <Input
                        id="videoCallPrice"
                        type="number"
                        min="0"
                        step="1000"
                        value={formData.pricing.videoCallPrice}
                        onChange={(e) => handlePricingChange(e, "videoCallPrice")}
                        required
                      />
                      <Label>가능한 시간대</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["오전", "오후", "저녁", "주말"].map((time) => (
                          <label key={time} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.videoCallAvailability.includes(time)}
                              onChange={(e) => {
                                const newAvailability = e.target.checked
                                  ? [...formData.videoCallAvailability, time]
                                  : formData.videoCallAvailability.filter((t) => t !== time);
                                setFormData({ ...formData, videoCallAvailability: newAvailability });
                              }}
                              className="rounded text-primary focus:ring-primary"
                            />
                            <span>{time}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="availableForOnlineReview"
                      checked={formData.availableForOnlineReview}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, availableForOnlineReview: checked })
                      }
                    />
                    <Label htmlFor="availableForOnlineReview">온라인 이력서 첨삭 제공</Label>
                  </div>
                  {formData.availableForOnlineReview && (
                    <div className="pl-6 space-y-2">
                      <Label htmlFor="onlineReviewPrice">온라인 이력서 첨삭 가격 (건당)</Label>
                      <Input
                        id="onlineReviewPrice"
                        type="number"
                        min="0"
                        step="1000"
                        value={formData.pricing.onlineReviewPrice}
                        onChange={(e) => handlePricingChange(e, "onlineReviewPrice")}
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="currency">통화</Label>
                    <RadioGroup
                      value={formData.pricing.currency}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          pricing: { ...formData.pricing, currency: value },
                        })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="KRW" id="KRW" />
                        <Label htmlFor="KRW">KRW (₩)</Label>
                      </div>
                    </RadioGroup>
                    {formData.pricing.currency === "custom" && (
                      <Input
                        placeholder="통화 입력 (예: EUR)"
                        value={formData.pricing.currency}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pricing: { ...formData.pricing, currency: e.target.value },
                          })
                        }
                        className="mt-2"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricingDescription">가격 설명 (선택사항)</Label>
                    <Textarea
                      id="pricingDescription"
                      value={formData.pricing.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing: { ...formData.pricing, description: e.target.value },
                        })
                      }
                      placeholder="가격에 대한 추가 설명을 입력하세요 (예: 패키지 할인, 특별 서비스 등)"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Email Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="font-medium">
                    이메일
                  </Label>
                  <Switch
                    checked={formData.showEmail}
                    onCheckedChange={() => toggleSection("showEmail")}
                  />
                </div>
                {formData.showEmail && (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange(e, "email")}
                    placeholder="이메일을 입력하세요"
                  />
                )}
              </div>

              {/* Tags Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">태그</Label>
                  <Switch
                    checked={formData.showTags}
                    onCheckedChange={() => toggleSection("showTags")}
                  />
                </div>
                {formData.showTags && (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        value={formData.currentTag}
                        onChange={(e) => handleChange(e, "currentTag")}
                        placeholder="태그 입력 후 추가"
                      />
                      <Button type="button" onClick={handleAddTag}>
                        추가
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Experience Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">경력 사항</Label>
                  <Switch
                    checked={formData.showExperiences}
                    onCheckedChange={() => toggleSection("showExperiences")}
                  />
                </div>
                {formData.showExperiences && (
                  <div className="space-y-4">
                    {formData.experiences.map((exp, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`company-${index}`}>회사명</Label>
                              <Input
                                id={`company-${index}`}
                                name="company"
                                value={exp.company}
                                onChange={(e) =>
                                  handleChange(e, "experiences", index)
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`position-${index}`}>직책</Label>
                              <Input
                                id={`position-${index}`}
                                name="position"
                                value={exp.position}
                                onChange={(e) =>
                                  handleChange(e, "experiences", index)
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`startDate-${index}`}>
                                시작일
                              </Label>
                              <Input
                                id={`startDate-${index}`}
                                name="startDate"
                                type="date"
                                value={exp.startDate}
                                onChange={(e) =>
                                  handleChange(e, "experiences", index)
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`endDate-${index}`}>종료일</Label>
                              <Input
                                id={`endDate-${index}`}
                                name="endDate"
                                type="date"
                                value={exp.endDate}
                                onChange={(e) =>
                                  handleChange(e, "experiences", index)
                                }
                                disabled={exp.current}
                              />
                            </div>
                          </div>
                          <div className="space-y-2 mt-4">
                            <Label htmlFor={`description-${index}`}>설명</Label>
                            <Textarea
                              id={`description-${index}`}
                              name="description"
                              value={exp.description}
                              onChange={(e) =>
                                handleChange(e, "experiences", index)
                              }
                              rows={3}
                            />
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) =>
                                  handleChange(
                                    {
                                      target: {
                                        name: "current",
                                        value: e.target.checked,
                                      },
                                    } as unknown as any,
                                    "experiences",
                                    index
                                  )
                                }
                                className="rounded text-primary focus:ring-primary"
                              />
                              <span>현재 재직중</span>
                            </label>
                            <Button
                              type="button"
                              onClick={() => handleRemoveExperience(index)}
                              variant="destructive"
                              size="sm"
                            >
                              <X className="w-4 h-4 mr-2" /> 삭제
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      type="button"
                      onClick={handleAddExperience}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" /> 경력 추가
                    </Button>
                  </div>
                )}
              </div>

              {/* Education Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">학력</Label>
                  <Switch
                    checked={formData.showEducation}
                    onCheckedChange={() => toggleSection("showEducation")}
                  />
                </div>
                {formData.showEducation && (
                  <div className="space-y-4">
                    {formData.education.map((edu, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`school-${index}`}>학교명</Label>
                              <Input
                                id={`school-${index}`}
                                name="school"
                                value={edu.school}
                                onChange={(e) =>
                                  handleChange(e, "education", index)
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`degree-${index}`}>학위</Label>
                              <Input
                                id={`degree-${index}`}
                                name="degree"
                                value={edu.degree}
                                onChange={(e) =>
                                  handleChange(e, "education", index)
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`field-${index}`}>전공</Label>
                              <Input
                                id={`field-${index}`}
                                name="field"
                                value={edu.field}
                                onChange={(e) =>
                                  handleChange(e, "education", index)
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`eduStartDate-${index}`}>
                                입학년도
                              </Label>
                              <Input
                                id={`eduStartDate-${index}`}
                                name="startDate"
                                type="date"
                                value={edu.startDate}
                                onChange={(e) =>
                                  handleChange(e, "education", index)
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`eduEndDate-${index}`}>
                                졸업년도
                              </Label>
                              <Input
                                id={`eduEndDate-${index}`}
                                name="endDate"
                                type="date"
                                value={edu.endDate}
                                onChange={(e) =>
                                  handleChange(e, "education", index)
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button
                              type="button"
                              onClick={() => handleRemoveEducation(index)}
                              variant="destructive"
                              size="sm"
                            >
                              <X className="w-4 h-4 mr-2" /> 삭제
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      type="button"
                      onClick={handleAddEducation}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" /> 학력 추가
                    </Button>
                  </div>
                )}
              </div>

              {/* Skills Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">스킬</Label>
                  <Switch
                    checked={formData.showSkills}
                    onCheckedChange={() => toggleSection("showSkills")}
                  />
                </div>
                {formData.showSkills && (
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((skill) => (
                        <Badge
                          key={skill}
                          variant={
                            formData.skills.includes(skill)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => handleToggleSkill(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full">
              등록하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
