import { Component, OnInit } from '@angular/core';
import { MongoApiService } from 'src/app/services/mongo-api.service';
import { Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-timeline-log',
  templateUrl: './timeline-log.component.html',
  styleUrls: ['./timeline-log.component.css']
})
export class TimelineLogComponent implements OnInit {

  constructor(private mongoApi: MongoApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.mongoApi.findCollection({ voucherId: res.businessKey }).subscribe(res => {
        console.log(res);
      })
    })
    this.load();

  }
  load() {

    $(document).ready(function () {

      // Local script for demo purpose only
      $('#lightVersion').click(function (event) {
        event.preventDefault()
        $('#ibox-content').removeClass('ibox-content');
        $('#vertical-timeline').removeClass('dark-timeline');
        $('#vertical-timeline').addClass('light-timeline');
      });

      $('#darkVersion').click(function (event) {
        event.preventDefault()
        $('#ibox-content').addClass('ibox-content');
        $('#vertical-timeline').removeClass('light-timeline');
        $('#vertical-timeline').addClass('dark-timeline');
      });

      $('#leftVersion').click(function (event) {
        event.preventDefault()
        $('#vertical-timeline').toggleClass('center-orientation');
      });


    });

  }

}
