import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SettingsService } from '../../settings.service';
import * as moment from 'moment';

@Component({
  selector: 'app-group-messages',
  templateUrl: './group-messages.component.html',
  styleUrls: ['./group-messages.component.scss']
})
export class GroupMessagesComponent implements OnInit {

  selectedPhones = []
  selectedBody: string
  phones = []
  showMessagesDialog: boolean = false

  @Input() group = []
  @Output() openDialog: EventEmitter<boolean> = new EventEmitter();
  @Output() updateDialog: EventEmitter<any> = new EventEmitter();


  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.getPhoneGroup()
  }
  initNotfi() {
    this.openDialog.emit(true)
  }
  updateNotf(value) {
    this.updateDialog.emit(value)

  }

  getPhoneGroup() {
    const subscription = this.settingsService.getPhoneGroup().subscribe((data: any) => {

      console.log(data);
      this.phones = data.phones
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

  sendMessages() {
    this.selectedPhones = this.selectedPhones.map(el => {
    return  el.phone
    })
    const phoneNumbers = this.selectedPhones.join(',');

    console.log(phoneNumbers);
    console.log(this.selectedBody);
    

    window.open(`https://web.whatsapp.com/send?phones=${phoneNumbers}&text=${this.selectedBody}`, "_blank")

  }
}
