import {
  Component,
  DestroyRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'cwm-input-search',
  standalone: true,
  imports: [IconFieldModule, InputIconModule, ReactiveFormsModule],
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.scss',
})
export class InputSearchComponent implements OnInit {
  placeHolder = input<string>('Typing user or message...');
  debounceTime = input<number>(200);
  isSearching = input<boolean>(false);
  searchControl = signal(new FormControl(''));

  searchChanges = output<string | null>();

  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.registerValueChanges();
  }

  private registerValueChanges() {
    this.searchControl()
      .valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(this.debounceTime()),
        distinctUntilChanged(),
        tap((keyword: string | null) => {
          this.searchChanges.emit(keyword);
        })
      )
      .subscribe();
  }
}
