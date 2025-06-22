import { getCourse } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, Video, FileText } from "lucide-react";

export default async function CoursesPage() {
    const course = await getCourse('og-101');
    if (!course) notFound();

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
                    <p className="text-muted-foreground">Structure and content for "{course.title}"</p>
                </div>
                <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Module
                </Button>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Course Structure</CardTitle>
                    <CardDescription>
                        Manage modules and lessons. Drag-and-drop to reorder (not implemented).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" className="w-full space-y-4">
                        {course.modules.map(module => (
                            <AccordionItem value={module.id} key={module.id} className="border rounded-lg bg-background">
                                <AccordionTrigger className="px-4 text-lg font-semibold hover:no-underline">
                                    <div className="flex items-center justify-between w-full">
                                        <span>{module.title}</span>
                                        <div className="flex items-center gap-2 mr-4">
                                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}><Edit className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-4 border-t">
                                    <ul className="space-y-3">
                                        {module.lessons.map(lesson => (
                                            <li key={lesson.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                                                <div className="flex items-center gap-3">
                                                    <Video className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <p className="font-medium">{lesson.title}</p>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <FileText className="h-3 w-3" />
                                                            <span>{lesson.resources.length} resource(s)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button variant="outline" className="mt-4">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Lesson
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}
