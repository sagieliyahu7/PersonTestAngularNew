import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  result = '';
  httpClient: HttpClient;
  constructor(http: HttpClient) {
    this.httpClient = http;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
  add() {
    if (!this.personForm.valid) {
      this.result = 'יש למלא את השדות';
      return;
    }
    this.httpClient.post<number>('https://localhost:7065/api/person/addPerson',
      {
        FullName: this.personForm.get('fullName')?.value,
        BirthDate: this.personForm.get('birthDate')?.value,
        IdNum: this.personForm.get('idNum')?.value
      }).subscribe(result => {
      }, error => console.error(error));
  }
  //parseDate(dateString: string): Date {
  //  if (dateString) {
  //    return new Date(dateString);
  //  }
  //  return null;
  //}
}
