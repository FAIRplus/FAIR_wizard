import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fair-wizard';
  searchText = '';

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  search() {
    let filters = this.processSearchText();
    this.redirectTo(filters);
  }

  processSearchText() {
    let filters = this.searchText.split('AND');
    this.searchText = '';
    if (filters.length ==1 && filters[0].trim() === '') {
      filters = [];
    }
    return filters;
  }

  // to fix same-page reload problem
  redirectTo(filters:string[]){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/resources'], {
        relativeTo: this.route,
        queryParams: {text: filters},
        queryParamsHandling: 'merge',
        skipLocationChange: false
      }));
  }
}
