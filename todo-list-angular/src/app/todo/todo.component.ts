import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from '../types/todo';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.states';
import { TodoRemove, TodoUpdate } from '../store/actions/todo.actions';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent implements OnInit {
  @Input() todo: Todo;

  isReadonly = true;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}

  toggleReadonly(toggle: boolean): void {
    if (this.todo.title === '') { return; }
    this.isReadonly = !toggle;
  }

  preventSelection(event: MouseEvent): void {
    if (event.detail > 1 && this.isReadonly) {
      event.preventDefault();
    }
  }

  updateState(state: boolean): void {
    const todo = new Todo('');
    Object.assign(todo, this.todo);
    todo.isDone = state;
    this.store.dispatch(new TodoUpdate(todo));
  }

  updateTitle(title: string): void {
    const todo = new Todo('');
    Object.assign(todo, this.todo);
    todo.title = title;
    this.store.dispatch(new TodoUpdate(todo));
  }

  remove(): void {
    this.store.dispatch(new TodoRemove(this.todo));
  }
}
