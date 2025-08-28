export const BOARD_COLUMNS = {
  ADMIN: [
    { id: 'todo', title: 'To Do', color: 'bg-blue-500' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-500' },
    { id: 'final-design', title: 'Final Design', color: 'bg-purple-500' },
    { id: 'review', title: 'Review', color: 'bg-orange-500' },
    { id: 'completed', title: 'Completed', color: 'bg-green-500' },
    { id: 'scheduled', title: 'Scheduled', color: 'bg-indigo-500' },
    { id: 'ads', title: 'Ads', color: 'bg-red-500' }
  ],
  CLIENT: [
    { id: 'todo', title: 'To Do', color: 'bg-blue-500' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-500' },
    { id: 'review', title: 'Review', color: 'bg-orange-500' },
    { id: 'completed', title: 'Completed', color: 'bg-green-500' },
    { id: 'scheduled', title: 'Scheduled', color: 'bg-indigo-500' },
    { id: 'ads', title: 'Ads', color: 'bg-red-500' }
  ]
}

export const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200'
}

export const FILE_SIZE_LIMIT = 200 * 1024 * 1024 // 200MB

export const SUPPORTED_FILE_TYPES = {
  documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
  images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'],
  videos: ['.mp4', '.mov', '.avi', '.wmv', '.mkv'],
  design: ['.psd', '.ai', '.sketch', '.fig'],
  archive: ['.zip', '.rar', '.7z'],
  spreadsheets: ['.xls', '.xlsx', '.csv']
}

export const EVENT_TYPES = [
  { value: 'meeting', label: 'Meeting', color: 'bg-blue-500' },
  { value: 'deadline', label: 'Deadline', color: 'bg-red-500' },
  { value: 'publication', label: 'Publication', color: 'bg-green-500' },
  { value: 'campaign', label: 'Campaign', color: 'bg-purple-500' },
  { value: 'standup', label: 'Standup', color: 'bg-orange-500' }
]

export const TRAJECTORIES = [
  'Social Media Strategy',
  'Content Creation',
  'Ad Campaign',
  'Brand Development',
  'Influencer Marketing',
  'Analytics & Reporting'
]

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
} as const

export const MESSAGE_TYPES = {
  TEXT: 'text',
  FILE: 'file',
  TASK_MENTION: 'task-mention',
  USER_MENTION: 'user-mention'
} as const