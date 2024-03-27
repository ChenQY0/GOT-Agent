export interface IHistory {
    readonly playerStepsTaken?: number;
    readonly msg: string;
  }

export interface IConversationModel {
    readonly isActive: boolean;
    readonly history: IHistory[]; // TODO will run into conversation limits currently, need to further nest this history
    readonly messages: IMessageModel[];
  }

export type ResponseActionType = 'farewell' | 'move' | 'reply';

export interface IMessageModel {
    readonly id: number;
    readonly text: string;
    readonly sender: 'me' | 'npc';
    readonly fullText: string;
    readonly errorMessage: string | undefined;
    readonly action?: ResponseActionType;
  }