import { Observable } from 'rxjs';

export enum LangKey {
  VI = 'VI',
  EN = 'EN',
}
export interface ITranslate {
  changeLanguage(key: LangKey): void;
  onLanguageChanges: Observable<LangKey>;
}
