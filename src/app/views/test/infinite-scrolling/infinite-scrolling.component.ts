import { NgModule, Component, enableProdMode, OnInit } from '@angular/core';
export class Employee {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: Date;
}



@Component({
  selector: 'app-infinite-scrolling',
  templateUrl: './infinite-scrolling.component.html',
  styleUrls: ['./infinite-scrolling.component.css']
})



export class InfiniteScrollingComponent {


  constructor() {
    this.dataSource = this.generateData(100000);
  }
  dataSource: any;
  employees: Employee[] = [];

  surnames: string[] = [
    "Smith",
    "Johnson",
    "Brown",
    "Taylor",
    "Anderson",
    "Harris",
    "Clark",
    "Allen",
    "Scott",
    "Carter"];

  names: string[] = [
    "James",
    "John",
    "Robert",
    "Christopher",
    "George",
    "Mary",
    "Nancy",
    "Sandra",
    "Michelle",
    "Betty"];

  gender: string[] = ["Male", "Female"];

  s: number = 123456789;




  customizeColumns(columns) {
    columns[0].width = 70;
  }
  random() {
    this.s = (1103515245 * this.s + 12345) % 2147483647;
    return this.s % (10 - 1);
  }


  generateData(count: number) {
    let i: number,
      startBirthDate = Date.parse("1/1/1975"),
      endBirthDate = Date.parse("1/1/1992");

    for (i = 0; i < count; i++) {
      let birthDate = new Date(startBirthDate + Math.floor(
        this.random() *
        (endBirthDate - startBirthDate) / 10));
      birthDate.setHours(12);

      let nameIndex = this.random();
      let item = {
        id: i + 1,
        firstName: this.names[nameIndex],
        lastName: this.surnames[this.random()],
        gender: this.gender[Math.floor(nameIndex / 5)],
        birthDate: birthDate
      };
      this.employees.push(item);
    }

    return this.employees;
  }



}
