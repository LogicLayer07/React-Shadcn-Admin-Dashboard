import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: QuestionMarkCircledIcon,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: CircleIcon,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: StopwatchIcon,
  },
  {
    value: 'done',
    label: 'Done',
    icon: CheckCircledIcon,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: CrossCircledIcon,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: ArrowDownIcon,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: ArrowRightIcon,
  },
  {
    label: 'High',
    value: 'high',
    icon: ArrowUpIcon,
  },
]


export const categories = [
  {
    value: 'Tops',
    label: 'Tops',
    icon: CircleIcon,
  },
  {
    value: 'Bottoms',
    label: 'Bottoms',
    icon: CheckCircledIcon,
  },
  {
    value: 'Shoes',
    label: 'Shoes',
    icon: StopwatchIcon,
  },
  {
    value: 'Accessories',
    label: 'Accessories',
    icon: QuestionMarkCircledIcon,
  },
]

export const brands = [
  {
    value: 'ComfortWear',
    label: 'ComfortWear',
    icon: CircleIcon,
  },
  {
    value: 'StylePro',
    label: 'StylePro',
    icon: CheckCircledIcon,
  },
  {
    value: 'ActiveFit',
    label: 'ActiveFit',
    icon: StopwatchIcon,
  },
  {
    value: 'UrbanTrend',
    label: 'UrbanTrend',
    icon: QuestionMarkCircledIcon,
  },
]