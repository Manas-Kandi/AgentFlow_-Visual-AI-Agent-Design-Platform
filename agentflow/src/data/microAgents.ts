import type { LucideIcon } from "lucide-react";
import { Search, FileText, Bot, Database, Mail, Calculator, Image, MessageSquare } from "lucide-react";

export interface MicroAgent {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const microAgents: MicroAgent[] = [
  {
    id: 'writer',
    name: 'Writer Agent',
    description: 'Generates written content from inputs',
    icon: FileText,
    color: 'bg-green-50 text-green-600'
  },
  {
    id: 'searcher',
    name: 'Web Search Agent',
    description: 'Searches and retrieves web content',
    icon: Search,
    color: 'bg-blue-50 text-blue-600'
  },
  {
    id: 'analyzer',
    name: 'Data Analyzer Agent',
    description: 'Analyzes and processes data',
    icon: Bot,
    color: 'bg-purple-50 text-purple-600'
  },
  {
    id: 'database',
    name: 'Database Agent',
    description: 'Queries and manages database operations',
    icon: Database,
    color: 'bg-orange-50 text-orange-600'
  },
  {
    id: 'email',
    name: 'Email Agent',
    description: 'Handles email reading and composition',
    icon: Mail,
    color: 'bg-red-50 text-red-600'
  },
  {
    id: 'calculator',
    name: 'Calculator Agent',
    description: 'Performs mathematical calculations',
    icon: Calculator,
    color: 'bg-yellow-50 text-yellow-600'
  },
  {
    id: 'image',
    name: 'Image Agent',
    description: 'Processes and analyzes images',
    icon: Image,
    color: 'bg-pink-50 text-pink-600'
  },
  {
    id: 'chat',
    name: 'Chat Agent',
    description: 'Handles conversational interactions',
    icon: MessageSquare,
    color: 'bg-indigo-50 text-indigo-600'
  }
];
