import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { User } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getFilePreview(file: { name: string; type: string; url: string }) {
  const isImage = file.type.startsWith('image/')
  const isPdf = file.type === 'application/pdf'
  const isVideo = file.type.startsWith('video/')
  
  return {
    isImage,
    isPdf,
    isVideo,
    canPreview: isImage || isPdf || isVideo
  }
}

export function generateTaskMention(taskId: string, taskTitle: string): string {
  return `@task:${taskId}:${taskTitle}`
}

export function generateUserMention(user: User): string {
  return `@user:${user.id}:${user.name}`
}

export function parseMessageMentions(content: string) {
  const taskMentions = content.match(/@task:([^:]+):([^@\s]+)/g) || []
  const userMentions = content.match(/@user:([^:]+):([^@\s]+)/g) || []
  
  return {
    taskMentions: taskMentions.map(mention => {
      const match = mention.match(/@task:([^:]+):(.+)/)
      return match ? { id: match[1], title: match[2] } : null
    }).filter(Boolean),
    userMentions: userMentions.map(mention => {
      const match = mention.match(/@user:([^:]+):(.+)/)
      return match ? { id: match[1], name: match[2] } : null
    }).filter(Boolean)
  }
}

export function renderMessageWithMentions(content: string): string {
  let rendered = content
  
  // Replace task mentions
  rendered = rendered.replace(/@task:([^:]+):([^@\s]+)/g, 
    '<span class="task-mention" data-task-id="$1">@$2</span>'
  )
  
  // Replace user mentions
  rendered = rendered.replace(/@user:([^:]+):([^@\s]+)/g, 
    '<span class="user-mention" data-user-id="$1">@$2</span>'
  )
  
  return rendered
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}