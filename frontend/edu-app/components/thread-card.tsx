"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ThreadCardProps {
  thread: {
    id: string
    title: string
    content: string
    author: {
      name: string
      avatar: string
    }
    course: string
    courseId: string
    tags: string[]
    votes: number
    replies: number
    createdAt: string
  }
  className?: string
}

export function ThreadCard({ thread, className }: ThreadCardProps) {
  return (
    <Card className={cn("card-hover", className)}>
      <CardHeader className="flex flex-row items-start gap-4 pb-2">
        <Avatar>
          <AvatarImage src={thread.author.avatar || "/placeholder.svg"} alt={thread.author.name} />
          <AvatarFallback>{thread.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-lg">{thread.title}</CardTitle>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="bg-primary/10">
              {thread.course}
            </Badge>
            {thread.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-muted">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{thread.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{thread.votes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{thread.replies}</span>
          </div>
          <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/forum/${thread.courseId}/${thread.id}`}>Ver</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
