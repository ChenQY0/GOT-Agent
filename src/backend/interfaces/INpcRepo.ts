
import { IConversationModel } from "./IConversationService";

export type StarSignType = 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export interface INpcModel {
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly age: number;
    readonly starSign: StarSignType;
    readonly personalHistory: string; 
    readonly personalKnowledge: string;

    readonly conversation: IConversationModel;
}

export default interface INpcRepo {
    getById(id: number): Promise<INpcModel>;
    update(updated: INpcModel): Promise<INpcModel>;
}