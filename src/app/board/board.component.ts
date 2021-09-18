import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  listTitleToggle: boolean = false;
  lists: any = [];


  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem("ListArray")) {
      let temp = (JSON.parse(localStorage.getItem("ListArray")));
      this.lists = temp;
    }
  }

  onSubmit(newListForm: NgForm) {
    let cards = new ListComponent();

    let newListItem = {
      'title': newListForm.value.listTitle,
      'cards': []
    }
    this.lists.push(newListItem);
    this.updateLocalStorage();
    this.listTitleToggle = false;
  }

  addList() {
    this.listTitleToggle = true;
  }

  updateLocalStorage() {
    localStorage.setItem('ListArray', JSON.stringify(this.lists));
  }
}
