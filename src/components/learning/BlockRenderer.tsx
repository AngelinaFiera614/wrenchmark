
import React from 'react';
import { ContentBlock } from '@/types/course';
import {
  TextBlock,
  VideoBlock,
  ImageGalleryBlock,
  TableBlock,
  DownloadBlock,
  GlossaryBlock,
  ModelBlock
} from './content-blocks';

interface BlockRendererProps {
  block: ContentBlock;
}

const getBlockRenderer = (type: string) => {
  const renderers: Record<string, React.ComponentType<any>> = {
    text: TextBlock,
    video: VideoBlock,
    image_gallery: ImageGalleryBlock,
    table: TableBlock,
    download: DownloadBlock,
    glossary_links: GlossaryBlock,
    related_models: ModelBlock,
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

  // Ensure data has the expected structure for each block type
  let blockData = block.data;
  
  // For text blocks or when falling back to TextBlock, ensure we have content property as string
  if (block.type === 'text' || BlockComponent === TextBlock) {
    blockData = {
      content: String(blockData?.content || ''),
      title: blockData?.title,
      ...blockData
    };
  }

  return <BlockComponent data={blockData} />;
}
