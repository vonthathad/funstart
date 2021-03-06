import { Subscription } from 'rxjs/Rx';


export abstract class ParentComponent {
  private subs: Subscription[] = [];
  
  protected set disposable(subscription: Subscription) {
    this.subs.push(subscription);
  }

  protected disposeSubscriptions() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}