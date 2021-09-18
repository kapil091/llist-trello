import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgForm } from '@angular/forms';
import * as _ from 'underscore';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() listTitle!: string;
  @Input() listIndex!: number;
  @Input() listArray!: any[];
  items = [];
  title = "";
  showAddCardDetails: boolean = false;
  newCardAddition: boolean = false;

  constructor() {

  }

  ngOnInit(): void {
    if (localStorage.getItem("ListArray")) {
      let tempListArray = JSON.parse(localStorage.getItem("ListArray"));
      if (tempListArray[this.listIndex]) {
        this.items = tempListArray[this.listIndex].cards;
      } else {
        this.items = [];
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    let previousListIdArray = event.previousContainer['id'].split("-");
    let nextListIdArray = event.container['id'].split("-");
    let previousListId = previousListIdArray[previousListIdArray.length - 1];
    let nextListId = nextListIdArray[nextListIdArray.length - 1];
    let tempListArray = JSON.parse(localStorage.getItem("ListArray"));
    tempListArray[previousListId].cards = event.previousContainer.data;
    tempListArray[nextListId].cards = event.container.data;
    tempListArray[nextListId].cards = _.sortBy(tempListArray[nextListId].cards, 'creation_time').reverse();
    localStorage.setItem('ListArray', JSON.stringify(tempListArray));
    this.ngOnInit();
  }

  remove(item: any) {
    this.items.splice(item, 1);
    this.listArray[this.listIndex].cards = this.items;
    this.updateLocalStorage();
  }

  removeList(listIndex: any) {
    this.listArray.splice(listIndex, 1);
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.setItem('ListArray', JSON.stringify(this.listArray));
  }

  addCardToggle() {
    this.newCardAddition = true;
    this.showAddCardDetails = true;
  }

  removeToggle() {
    this.newCardAddition = false;
  }

  onSubmit(newItemForm: NgForm) {
    if (!newItemForm.value.cardTitle || !newItemForm.value.cardDescription) {
      return;
    }
    let newItem = {
      'title': newItemForm.value.cardTitle,
      'desc': newItemForm.value.cardDescription,
      'creation_time': new Date()
    }
    if (this.items.length > 0) {
      this.items.push(newItem);
    } else {
      this.items = [newItem];
    }
    this.listArray[this.listIndex].cards = this.items;
    this.updateLocalStorage();
    newItemForm.reset();
    this.showAddCardDetails = false;
    this.newCardAddition = false;
  }
}
