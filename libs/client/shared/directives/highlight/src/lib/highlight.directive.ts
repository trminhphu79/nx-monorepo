import {
  Directive,
  effect,
  ElementRef,
  input,
  output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[cwmHighlight]',
  standalone: true,
})
export class HighLightDirective {
  highlight = input(false);
  highlightClass = input<string>('highlight-new-conversation-msg');
  highlightDuration = input<number>(2000);

  offHighlight = output();

  constructor(private el: ElementRef, private renderer: Renderer2) {
    effect(() => {
      console.log('highlight: ', this.highlight());
      if (this.highlight()) {
        this.triggerHighlight();
      }
    });
  }

  private triggerHighlight(): void {
    this.renderer.addClass(this.el.nativeElement, this.highlightClass());
    setTimeout(() => {
      this.renderer.removeClass(this.el.nativeElement, this.highlightClass());
      this.offHighlight.emit();
    }, this.highlightDuration());
  }
}
