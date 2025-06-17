
import React from 'react';
import { ContentBlock } from '@/types/course';
import {
  TextBlock,
  VideoBlock,
  ImageGalleryBlock,
  TableBlock,
  DownloadBlock,
  GlossaryBlock,
  ModelBlock,
  RichTextBlock,
  InteractiveQuizBlock,
  CodeHighlightBlock,
  AudioPlayerBlock,
  InteractiveImageBlock,
  ConditionalContentBlock
} from './content-blocks';

interface BlockRendererProps {
  block: ContentBlock;
}

const getBlockRenderer = (type: string) => {
  const renderers: Record<string, React.ComponentType<any>> = {
    // Legacy blocks
    text: TextBlock,
    video: VideoBlock,
    image_gallery: ImageGalleryBlock,
    table: TableBlock,
    download: DownloadBlock,
    glossary_links: GlossaryBlock,
    related_models: ModelBlock,
    
    // Enhanced blocks
    rich_text: RichTextBlock,
    interactive_quiz: InteractiveQuizBlock,
    code_highlight: CodeHighlightBlock,
    audio_player: AudioPlayerBlock,
    interactive_image: InteractiveImageBlock,
    conditional_content: ConditionalContentBlock,
  };

  return renderers[type] || TextBlock; // Fallback to TextBlock
};

export default function BlockRenderer({ block }: BlockRendererProps) {
  const BlockComponent = getBlockRenderer(block.type);
  
  if (!BlockComponent) {
    console.warn(`Unknown block type: ${block.type}`);
    return (
      <div className="p-4 border border-yellow-500 rounded-lg bg-yellow-500/10">
        <p className="text-yellow-600">Unknown block type: {block.type}</p>
      </div>
    );
  }

  // Pass data directly - let each component handle its own validation
  return <BlockComponent data={block.data || {}} />;
}
