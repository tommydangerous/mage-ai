import React from 'react';
import { Meta, Story } from '@storybook/react';
import ThemeBlock from 'stories/ThemeBlock';

import {
  Action,
  Add,
  AlertCircle,
  Alphabet,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Binary,
  CalendarDate,
  CaretDown,
  CaretRight,
  Categories,
  Category,
  Chat,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Close,
  Code,
  Column,
  Copy,
  Cursor,
  Edit,
  Email,
  File as FileIcon,
  FileFill as FilledFileIcon,
  Folder,
  Graph,
  GraphWithNodes,
  IDLetters,
  Info,
  Input,
  Insights,
  MapPin,
  Menu,
  MultiShare,
  NavData,
  NavGraph,
  NavReport,
  NavTree,
  NumberHash,
  NumberWithDecimalHash,
  Phone,
  Pipeline,
  PlayButton,
  PreviewHidden,
  PreviewOpen,
  Report,
  RoundedSquare,
  Search,
  Sort,
  Stack,
  Switch,
  Trash,
} from '@oracle/icons';

const ICONS = [
  Action,
  Add,
  AlertCircle,
  Alphabet,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUp,
  Binary,
  CalendarDate,
  CaretDown,
  CaretRight,
  Categories,
  Category,
  Chat,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Close,
  Code,
  Column,
  Copy,
  Cursor,
  Edit,
  Email,
  FileIcon,
  FilledFileIcon,
  Folder,
  Graph,
  GraphWithNodes,
  IDLetters,
  Info,
  Input,
  Insights,
  MapPin,
  Menu,
  MultiShare,
  NavData,
  NavGraph,
  NavReport,
  NavTree,
  NumberHash,
  NumberWithDecimalHash,
  Phone,
  Pipeline,
  PlayButton,
  PreviewHidden,
  PreviewOpen,
  Report,
  RoundedSquare,
  Search,
  Sort,
  Stack,
  Switch,
  Trash,
];

const Icons = () => (
  <>
    {ICONS.map(Icon => (
      <ThemeBlock
        // @ts-ignore
        key={Icon.displayName}
        reducedPadding
        // @ts-ignore
        title={Icon.displayName}
      >
        <Icon />
      </ThemeBlock>
    ))}
  </>
);

export default {
  component: Icons,
  title: 'Oracle/Icons',
} as Meta;

const Template: Story = () => <Icons />;

export const Main = Template.bind({});
