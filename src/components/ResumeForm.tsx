import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, CustomSection } from '../types';
import { structureResumeData } from '../services/gemini';
import { saveImage, loadImage, deleteImage } from '../services/db';
import { Sparkles, Loader2, User, Briefcase, Trash2, Plus, ChevronDown, ChevronUp, Layers, Target, GraduationCap, Award, Heart } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Label } from './ui/Label';
import { Accordion, AccordionItem } from './ui/Accordion';

interface ResumeFormProps { data: ResumeData; onChange: (data: ResumeData) => void; activeTemplate: string; }
const IMG_KEY_PREFIX = 'profile_img_';

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange, activeTemplate }) => {
  const [unstructuredText, setUnstructuredText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showJobDesc, setShowJobDesc] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imgKeyRef = useRef<string>('');

  useEffect(() => {
    imgKeyRef.current = IMG_KEY_PREFIX + data.personalInfo.fullName;
    loadImage(imgKeyRef.current).then((url) => { if (url) setPreviewUrl(url); });
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, []);

  const handlePersonalInfo = (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, personalInfo: { ...data.personalInfo, [e.target.name]: e.target.value } });
  
  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    await saveImage(imgKeyRef.current, file);
    onChange({ ...data, personalInfo: { ...data.personalInfo, profileImage: imgKeyRef.current } });
  };
  
  const removeImage = async () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null); await deleteImage(imgKeyRef.current);
    onChange({ ...data, personalInfo: { ...data.personalInfo, profileImage: undefined } });
  };

  const handleAiMagic = async () => {
    if (!unstructuredText.trim()) return;
    setIsAiLoading(true);
    try {
      const s = await structureResumeData(unstructuredText, jobDescription || undefined);
      onChange({ ...data, aiContent: { ...data.aiContent, ...s, skills: s.skills || data.aiContent.skills, customSections: s.customSections || data.aiContent.customSections } });
    } finally { setIsAiLoading(false); }
  };

  const updateArr = (arr: any[], i: number, field: string, value: any, key: string) => {
    const newArr = [...arr]; newArr[i] = { ...newArr[i], [field]: value };
    onChange({ ...data, aiContent: { ...data.aiContent, [key]: newArr } });
  };

  const AlignmentToggle = ({ sectionId }: { sectionId: string }) => {
    if (activeTemplate === 'ATS') return null;
    const align = data.sectionConfig?.[sectionId]?.alignment || 'right';
    return (
      <div className="flex bg-secondary p-1 rounded-lg gap-1 border">
        {(['left', 'right'] as const).map((d) => (
          <button key={d} onClick={() => onChange({ ...data, sectionConfig: { ...(data.sectionConfig || {}), [sectionId]: { id: sectionId, alignment: d, order: 0 } } })}
            className={`px-3 py-1 text-[10px] font-bold rounded-md ${align === d ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>
            {d.toUpperCase()}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-32 max-w-3xl mx-auto w-full">
      <Card className="border-primary/10 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Sparkles className="w-5 h-5" /> AI Build Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            value={unstructuredText} onChange={(e) => setUnstructuredText(e.target.value)} 
            placeholder="Paste raw unformatted text (LinkedIn profile, rough notes)... AI will perfectly structure it." className="min-h-[120px] bg-background text-base" />
          <div className="pt-2">
            <Button variant="ghost" size="sm" onClick={() => setShowJobDesc(!showJobDesc)} className="text-xs">
              <Target className="w-4 h-4 mr-2" /> {showJobDesc ? 'Hide' : 'Add'} Job Description for ATS
            </Button>
            {showJobDesc && (
              <Textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste job posting here..." className="mt-2 min-h-[100px] bg-background"/>
            )}
          </div>
          <Button onClick={handleAiMagic} disabled={isAiLoading || !unstructuredText.trim()} className="w-full text-base py-6 shadow-xl shadow-primary/20">
            {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
            {isAiLoading ? 'Synthesizing...' : 'Generate Resume Magic'}
          </Button>
        </CardContent>
      </Card>

      <Accordion className="space-y-4">
        <AccordionItem title={<span className="flex items-center gap-2"><User className="w-4 h-4 text-primary"/> Personal Information</span>} defaultOpen>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1"><Label>Full Name</Label><Input name="fullName" value={data.personalInfo.fullName} onChange={handlePersonalInfo} placeholder="John Doe" /></div>
            <div className="space-y-1"><Label>Email</Label><Input name="email" value={data.personalInfo.email} onChange={handlePersonalInfo} placeholder="john@example.com" /></div>
            <div className="space-y-1"><Label>Designation</Label><Input name="designation" value={data.personalInfo.designation} onChange={handlePersonalInfo} placeholder="Senior Web Developer" /></div>
            <div className="space-y-1"><Label>Contact No</Label><Input name="contactNo" value={data.personalInfo.contactNo} onChange={handlePersonalInfo} placeholder="+1 234 567 890" /></div>
            <div className="md:col-span-2 space-y-1"><Label>Address</Label><Input name="address" value={data.personalInfo.address} onChange={handlePersonalInfo} placeholder="New York, USA" /></div>
            <div className="md:col-span-2 space-y-2 pt-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                {previewUrl && <img src={previewUrl} className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-primary/20" alt="profile"/>}
                <div className="flex-1">
                  <Input type="file" accept="image/*" onChange={handleImage} className="cursor-pointer file:cursor-pointer p-0 file:py-2 file:px-4 file:bg-primary file:text-primary-foreground file:border-0 file:rounded-xl file:mr-4 file:font-semibold" />
                </div>
                {previewUrl && <Button variant="destructive" size="icon" onClick={removeImage}><Trash2 className="w-4 h-4"/></Button>}
              </div>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem title={<span className="flex items-center gap-2"><Target className="w-4 h-4 text-primary"/> Professional Summary</span>}
          headerAction={<AlignmentToggle sectionId="summary" />}>
          <Textarea value={data.aiContent.summary} onChange={(e) => onChange({ ...data, aiContent: { ...data.aiContent, summary: e.target.value } })} className="min-h-[120px] text-base" placeholder="Professional summary..." />
        </AccordionItem>

        <AccordionItem title={<span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary"/> Experience & Work History</span>}
          headerAction={<div className="flex gap-2"><AlignmentToggle sectionId="experience" /><Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onChange({ ...data, aiContent: { ...data.aiContent, experience: [...data.aiContent.experience, { company: '', position: '', startDate: '', endDate: '', description: '' }] } }); }}><Plus className="w-4 h-4 mr-1"/> Add</Button></div>}>
          <div className="space-y-4">
            {data.aiContent.experience.map((exp, i) => (
              <Card key={i} className="relative group overflow-hidden bg-background">
                <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={() => onChange({ ...data, aiContent: { ...data.aiContent, experience: data.aiContent.experience.filter((_, idx) => idx !== i) } })}><Trash2 className="w-4 h-4"/></Button>
                <CardContent className="p-4 space-y-3 pt-6">
                  <Input value={exp.position} onChange={(e) => updateArr(data.aiContent.experience, i, 'position', e.target.value, 'experience')} placeholder="Position/Title" className="font-bold text-lg border-0 border-b rounded-none px-0 bg-transparent focus-visible:ring-0" />
                  <Input value={exp.company} onChange={(e) => updateArr(data.aiContent.experience, i, 'company', e.target.value, 'experience')} placeholder="Company" className="border-0 border-b rounded-none px-0 bg-transparent focus-visible:ring-0" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input value={exp.startDate} onChange={(e) => updateArr(data.aiContent.experience, i, 'startDate', e.target.value, 'experience')} placeholder="Start Date" className="text-sm bg-transparent" />
                    <Input value={exp.endDate} onChange={(e) => updateArr(data.aiContent.experience, i, 'endDate', e.target.value, 'experience')} placeholder="End Date / Present" className="text-sm bg-transparent" />
                  </div>
                  <Textarea value={exp.description} onChange={(e) => updateArr(data.aiContent.experience, i, 'description', e.target.value, 'experience')} placeholder="Achievements, responsibilities..." className="min-h-[100px]" />
                </CardContent>
              </Card>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem title={<span className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary"/> Education</span>}
          headerAction={<div className="flex gap-2"><AlignmentToggle sectionId="education" /><Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onChange({ ...data, aiContent: { ...data.aiContent, education: [...data.aiContent.education, { institution: '', degree: '', startDate: '', endDate: '', description: '' }] } }); }}><Plus className="w-4 h-4 mr-1"/> Add</Button></div>}>
          <div className="space-y-4">
            {data.aiContent.education.map((edu, i) => (
              <Card key={i} className="relative group overflow-hidden bg-background">
                <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={() => onChange({ ...data, aiContent: { ...data.aiContent, education: data.aiContent.education.filter((_, idx) => idx !== i) } })}><Trash2 className="w-4 h-4"/></Button>
                <CardContent className="p-4 space-y-3 pt-6">
                  <Input value={edu.degree} onChange={(e) => updateArr(data.aiContent.education, i, 'degree', e.target.value, 'education')} placeholder="Degree / Certificate" className="font-bold text-lg border-0 border-b rounded-none px-0 bg-transparent focus-visible:ring-0" />
                  <Input value={edu.institution} onChange={(e) => updateArr(data.aiContent.education, i, 'institution', e.target.value, 'education')} placeholder="Institution" className="border-0 border-b rounded-none px-0 bg-transparent focus-visible:ring-0" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input value={edu.startDate} onChange={(e) => updateArr(data.aiContent.education, i, 'startDate', e.target.value, 'education')} placeholder="Start Date" className="text-sm bg-transparent" />
                    <Input value={edu.endDate} onChange={(e) => updateArr(data.aiContent.education, i, 'endDate', e.target.value, 'education')} placeholder="End Date" className="text-sm bg-transparent" />
                  </div>
                  <Input value={edu.description} onChange={(e) => updateArr(data.aiContent.education, i, 'description', e.target.value, 'education')} placeholder="GPA / Honors (optional)" className="bg-transparent" />
                </CardContent>
              </Card>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem title={<span className="flex items-center gap-2"><Award className="w-4 h-4 text-primary"/> Skills</span>}
          headerAction={<div className="flex gap-2"><AlignmentToggle sectionId="skills" /><Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onChange({ ...data, aiContent: { ...data.aiContent, skills: [...data.aiContent.skills, { name: '', level: 5 }] } }); }}><Plus className="w-4 h-4 mr-1"/> Add</Button></div>}>
          <div className="space-y-2">
            {data.aiContent.skills.map((skill, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-secondary/50 rounded-xl group relative">
                <Input value={skill.name} onChange={(e) => updateArr(data.aiContent.skills, i, 'name', e.target.value, 'skills')} placeholder="Skill (e.g. React)" className="bg-background" />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button key={level} onClick={() => updateArr(data.aiContent.skills, i, 'level', level, 'skills')}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${skill.level >= level ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-background hover:bg-muted text-muted-foreground'}`}>{level}</button>
                  ))}
                </div>
                <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => onChange({ ...data, aiContent: { ...data.aiContent, skills: data.aiContent.skills.filter((_, idx) => idx !== i) } })}><Trash2 className="w-4 h-4"/></Button>
              </div>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem title={<span className="flex items-center gap-2"><Heart className="w-4 h-4 text-primary"/> Hobbies & Goals</span>}
          headerAction={<AlignmentToggle sectionId="hobbies" />}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Hobbies</Label>
              <div className="flex flex-wrap gap-2">
                {data.aiContent.hobbies.map((h, i) => (
                  <div key={i} className="flex items-center bg-secondary rounded-lg px-2 shadow-sm border">
                    <input value={h} onChange={(e) => { const nh = [...data.aiContent.hobbies]; nh[i] = e.target.value; onChange({...data, aiContent: {...data.aiContent, hobbies: nh}}); }} className="bg-transparent w-24 text-sm font-medium py-1.5 outline-none" />
                    <button onClick={() => onChange({...data, aiContent: {...data.aiContent, hobbies: data.aiContent.hobbies.filter((_, idx) => idx !== i)}})} className="text-muted-foreground hover:text-destructive p-1 rounded"><Trash2 className="w-3 h-3"/></button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => onChange({...data, aiContent: {...data.aiContent, hobbies: [...data.aiContent.hobbies, '']}})} className="h-8 py-0"><Plus className="w-3 h-3 mr-1"/> Add</Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center"><Label>Career Goals</Label><AlignmentToggle sectionId="goals" /></div>
              <Textarea value={data.aiContent.goals} onChange={(e) => onChange({...data, aiContent: {...data.aiContent, goals: e.target.value}})} placeholder="Career goals..." className="min-h-[100px] bg-background" />
            </div>
          </div>
        </AccordionItem>
          
        <AccordionItem title={<span className="flex items-center gap-2"><Layers className="w-4 h-4 text-primary"/> Custom Sections</span>}
          headerAction={<Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onChange({ ...data, aiContent: { ...data.aiContent, customSections: [...(data.aiContent.customSections || []), { id: Math.random().toString(36).substr(2, 9), title: '', content: '' }] } }); }}><Plus className="w-4 h-4 mr-1"/> Add</Button>}>
          <div className="space-y-4">
            {data.aiContent.customSections?.map((sec) => (
              <Card key={sec.id} className="relative group overflow-hidden bg-background">
                <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={() => onChange({ ...data, aiContent: { ...data.aiContent, customSections: data.aiContent.customSections.filter(s => s.id !== sec.id) } })}><Trash2 className="w-4 h-4"/></Button>
                <CardContent className="p-4 space-y-3 pt-6">
                  <div className="flex justify-between"><Label>Section Title</Label><AlignmentToggle sectionId={sec.id} /></div>
                  <Input value={sec.title} onChange={(e) => onChange({ ...data, aiContent: { ...data.aiContent, customSections: data.aiContent.customSections.map(s => s.id === sec.id ? { ...s, title: e.target.value } : s) } })} placeholder="e.g. Certifications" className="font-bold border-0 border-b rounded-none px-0 bg-transparent focus-visible:ring-0" />
                  <Textarea value={sec.content} onChange={(e) => onChange({ ...data, aiContent: { ...data.aiContent, customSections: data.aiContent.customSections.map(s => s.id === sec.id ? { ...s, content: e.target.value } : s) } })} placeholder="Content..." className="min-h-[100px] bg-transparent" />
                </CardContent>
              </Card>
            ))}
          </div>
        </AccordionItem>

      </Accordion>
    </div>
  );
};
