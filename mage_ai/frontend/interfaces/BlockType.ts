import FeatureType from '@interfaces/FeatureType';
import { ActionTypeEnum, AxisEnum } from './ActionPayloadType';
import { DataSourceTypeEnum } from './DataSourceType';
import { DataTypeEnum } from './KernelOutputType';

export enum BlockTypeEnum {
  CHART = 'chart',
  DATA_EXPORTER = 'data_exporter',
  DATA_LOADER = 'data_loader',
  SCRATCHPAD = 'scratchpad',
  TRANSFORMER = 'transformer',
}

export const BLOCK_TYPES = [
  BlockTypeEnum.DATA_EXPORTER,
  BlockTypeEnum.DATA_LOADER,
  BlockTypeEnum.SCRATCHPAD,
  BlockTypeEnum.TRANSFORMER,
];

export enum StatusTypeEnum {
  EXECUTED = 'executed',
  FAILED = 'failed',
  NOT_EXECUTED = 'not_executed',
  UPDATED = 'updated',
}

export interface SampleDataType {
  columns: string[];
  rows: string[][] | number[][];
}

export interface OutputType {
  sample_data: SampleDataType;
  text_data: string;
  type: DataTypeEnum;
  variable_uuid: string;
}

export interface InsightType {
  feature: FeatureType;
}

export interface MetadataType {
  [uuid: string]: string | number;
}

export interface StatisticsType {
  [key: string]: {
    [key: string]: number;
  };
}

export interface AnalysisType {
  insights: InsightType[][];
  metadata: MetadataType;
  statistics: StatisticsType;
  suggestions: any;
  variable_uuid: string;
}

export interface BlockRequestPayloadType {
  name?: string;
  type: BlockTypeEnum;
  config?: {
    data_source?: DataSourceTypeEnum;
    action_type?: ActionTypeEnum;
    axis?: AxisEnum;
  };
}

enum ChartTypeEnum {
  HISTOGRAM = 'histogram',
}

interface ConfigurationType {
  chart_type: ChartTypeEnum;
  width_percentage: number;
}

export default interface BlockType {
  all_upstream_blocks_executed?: boolean;
  configuration?: ConfigurationType;
  content?: string;
  downstream_blocks?: string[];
  file?: string;
  name?: string;
  outputs?: OutputType[];
  priority?: number;
  status?: StatusTypeEnum;
  type?: BlockTypeEnum;
  upstream_blocks?: string[];
  uuid?: string;
}

export const BLOCK_TYPE_NAME_MAPPING = {
  [BlockTypeEnum.DATA_EXPORTER]: 'Data exporter',
  [BlockTypeEnum.DATA_LOADER]: 'Data loader',
  [BlockTypeEnum.SCRATCHPAD]: 'Scratchpad',
  [BlockTypeEnum.TRANSFORMER]: 'Transformer',
};

export const BLOCK_TYPE_CONVERTIBLE = [
  BlockTypeEnum.DATA_EXPORTER,
  BlockTypeEnum.DATA_LOADER,
  BlockTypeEnum.TRANSFORMER,
];

export const BLOCK_TYPE_ABBREVIATION_MAPPING = {
  [BlockTypeEnum.DATA_EXPORTER]: 'DE',
  [BlockTypeEnum.DATA_LOADER]: 'DL',
  [BlockTypeEnum.SCRATCHPAD]: 'SP',
  [BlockTypeEnum.TRANSFORMER]: 'TF',
};

export type SetEditingBlockType = {
  setEditingBlock: (data: {
    upstreamBlocks: {
      block: BlockType;
      values: BlockType[];
    };
  }) => void;
};
