import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';
import { action, defineProperty } from '@ember/object';

export default class ConsulServiceList extends Component {
  @service('filter') filter;
  @service('sort') sort;
  @service('search') search;

  get items() {
    defineProperty(this, 'sorted', sort('searched', this.comparator));
    return this.sorted;
  }

  get searched() {
    if (typeof this.args.search === 'undefined') {
      return this.filtered;
    }
    const predicate = this.search.predicate('service');
    return this.filtered.filter(
      predicate(this.args.search, {properties: this.args.filters.searchproperties})
    );
  }

  get filtered() {
    const predicate = this.filter.predicate('service');
    return this.args.items.filter(predicate(this.args.filters));
  }

  get comparator() {
    return this.sort.comparator('service')(this.args.sort);
  }

  @action
  isLinkable (item) {
    return item.InstanceCount > 0
  }
}
