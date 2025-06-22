
'use client';

import { useState, useEffect, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { updateLessonAction, type UpdateLessonFormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, File as FileIcon, Upload } from 'lucide-react';
import type { Lesson, Resource } from '@/lib/types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export function EditLessonDialog({ lesson, courseId }: { lesson: Lesson; courseId: string; }) {
  const [open, setOpen] = useState(false);
  const initialState: UpdateLessonFormState = { message: '', status: 'idle' };
  
  const [state, formAction] = useActionState(updateLessonAction, initialState);

  // State for managing resources in the UI
  const [currentResources, setCurrentResources] = useState<Resource[]>(lesson.resources);
  const [resourcesToDelete, setResourcesToDelete] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);

  useEffect(() => {
    if (state.status === 'success') {
      setOpen(false); // Close dialog on success
    }
  }, [state, setOpen]);

  useEffect(() => {
    // Reset state when dialog is closed/re-opened
    if (open) {
      setCurrentResources(lesson.resources);
      setResourcesToDelete([]);
      setNewFiles([]);
      setSelectedVideoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open, lesson.resources]);

  const handleRemoveResource = (resourceId: string) => {
    setCurrentResources(currentResources.filter(r => r.id !== resourceId));
    if (!resourcesToDelete.includes(resourceId)) {
      setResourcesToDelete([...resourcesToDelete, resourceId]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Combine new files with existing ones, avoiding duplicates
      const newFileList = Array.from(event.target.files);
      setNewFiles(prevFiles => {
        const existingNames = new Set(prevFiles.map(f => f.name));
        const trulyNew = newFileList.filter(f => !existingNames.has(f.name));
        return [...prevFiles, ...trulyNew];
      });
    }
  };

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedVideoFile(event.target.files[0]);
    } else {
      setSelectedVideoFile(null);
    }
  };
  
  const handleRemoveNewFile = (fileName: string) => {
    setNewFiles(newFiles.filter(f => f.name !== fileName));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
          <DialogDescription>
            Make changes to the lesson details, including title and resources.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <input type="hidden" name="lessonId" value={lesson.id} />
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="resourcesToDelete" value={resourcesToDelete.join(',')} />
          
          <div className="space-y-2">
            <Label htmlFor="lessonTitle">Lesson Title</Label>
            <Input id="lessonTitle" name="lessonTitle" defaultValue={lesson.title} required />
          </div>

          <div className="space-y-2">
            <Label>Lesson Video</Label>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="upload">Upload File</TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="mt-4">
                <Label htmlFor="lessonVideoUrl">Video URL</Label>
                <Input 
                  id="lessonVideoUrl" 
                  name="lessonVideoUrl" 
                  defaultValue={lesson.videoUrl || ''} 
                  placeholder="e.g., https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Provide a direct video URL or a YouTube link.
                </p>
              </TabsContent>
              <TabsContent value="upload" className="mt-4">
                <Label htmlFor="lessonVideoFile">Video File</Label>
                <Input 
                  id="lessonVideoFile" 
                  name="lessonVideoFile" 
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                />
                {selectedVideoFile && <p className="text-xs text-muted-foreground mt-1">Selected: {selectedVideoFile.name}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a video file from your computer.
                </p>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <Label>Downloadable Resources</Label>
            <div className="space-y-3 rounded-lg border p-4">
              {currentResources.length === 0 && newFiles.length === 0 && (
                <p className="text-sm text-muted-foreground">No resources for this lesson.</p>
              )}
              {currentResources.map(resource => (
                <div key={resource.id} className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2 truncate">
                     <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                     <span className='truncate' title={resource.name}>{resource.name}</span>
                   </div>
                   <Button type="button" variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => handleRemoveResource(resource.id)}>
                     <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
              ))}
               {newFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded-md">
                   <div className="flex items-center gap-2 truncate">
                     <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                     <span className='truncate' title={file.name}>{file.name}</span>
                   </div>
                   <Button type="button" variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => handleRemoveNewFile(file.name)}>
                     <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
              ))}
            </div>
            
            <input
              type="file"
              name="newResources"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Add Files
            </Button>
          </div>

          {state.status === 'error' && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <DialogFooter className="mt-4 pt-4 border-t">
            <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
