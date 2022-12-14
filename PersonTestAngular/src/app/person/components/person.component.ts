import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Person } from '../models/person.interface';
import { isValidIsraeliID } from '../utils/IsraeliIdValidation';

@Component({
  selector: 'person-root',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit, OnDestroy {
  title = 'People management';
  personForm = new FormGroup({
    fullName: new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.pattern('[a-zA-Z\u0590-\u05fe ]+')]),
    birthDate: new FormControl(null, [Validators.required]),
    idNum: new FormControl(null, [Validators.required, isValidIsraeliID])
  });
  httpClient: HttpClient;
  invalidFullName = false;
  invalidIsraeliIdNum = false;
  invalidBirthDate = false;
  isSuccess = false;
  isFailed = false;
  successMessage = '';
  failMessage = '';
  people: Person[] | undefined;
  constructor(http: HttpClient) {
    this.httpClient = http;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
  addPerson() {
    this.people = undefined;
    this.isSuccess = false;
    this.isFailed = false;
    this.invalidFullName = !this.personForm.get('fullName')?.valid;
    this.invalidBirthDate = !this.personForm.get('birthDate')?.valid;
    this.invalidIsraeliIdNum = !this.personForm.get('idNum')?.valid;
    if (!this.personForm.valid) {
      return;
    }

    this.httpClient.post<any>('https://localhost:7065/api/person/addPerson',
      {
        FullName: this.personForm.get('fullName')?.value,
        BirthDate: this.personForm.get('birthDate')?.value,
        IdNum: this.padLeftZeros(String(this.personForm.get('idNum')?.value), 9)
      }).subscribe(response => {
        if (response.IsSuccess) {
          this.successMessage = 'The person has been successfully added.'
          this.isSuccess = true;
        } else {
          this.failMessage = 'The person by id already exists.';
          this.isFailed = true;
        }
        this.isSuccess = response.IsSuccess;
      }, error => {
        this.failMessage = 'Some error occurred.';
        this.isFailed = true;
        console.error(error)
      });
  }
  getAllPeople() {
    this.people = undefined;
    this.isSuccess = false;
    this.isFailed = false;

    this.httpClient.post<any>('https://localhost:7065/api/person/getAllPeople',
      {}).subscribe(response => {
        if (response.IsSuccess) {
          this.people = JSON.parse(response.Result);
        } else {
          this.failMessage = 'No people data.';
          this.isFailed = true;
        }
      }, error => {
        this.failMessage = 'Some error occurred.';
        this.isFailed = true;
        console.error(error)
      });
  }

  deleteData() {
    this.people = undefined;
    this.isSuccess = false;
    this.isFailed = false;

    this.httpClient.post<any>('https://localhost:7065/api/person/deleteData',
      {}).subscribe(response => {
        this.successMessage = 'The data has been successfully deleted.'
        this.isSuccess = true;
      }, error => {
        this.failMessage = 'Some error occurred.';
        this.isFailed = true;
        console.error(error)
      });
  }

  padLeftZeros(num: string, size: number) {
    if (num) {
      while (num.length < size) { num = "0" + num };
    }
    return num;
  }
}
