import { Component, OnInit ,Input} from '@angular/core';
import { EngineService } from 'src/app/services/engine.service';
import { ActivatedRoute } from '@angular/router';
import BpmnViewer from 'bpmn-js';
import { Task } from 'src/app/models/camunda';
import $ from 'jquery';
@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent implements OnInit {
  @Input() taskItem: Task;
  
  taskCount:number=0;
  taskList: Task[];
  constructor(private engine: EngineService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((res)=>{
      this.engine.getByTaskId(res.id).subscribe((data)=>{
        var datas:any = data;
          this.engine.getDiagramByProDefId(datas.processDefinitionId)
          .subscribe((diagram)=>{
           
            var xml = diagram.bpmn20Xml;
            var viewer = new BpmnViewer({container: '#diagramCanvas', width: '1000px', height: '500px'});
            var container = $('#js-drop-zone');
           
            viewer.importXML(xml, function(err) {

              if (err) {
                console.log('error rendering', err);
              } else {
                var canvas = viewer.get('canvas');
									// zoom to fit full viewport
                  canvas.zoom('fit-viewport');
                  container.removeClass('bjs-powered-by');
									container.removeClass('with-error')
											 .addClass('with-diagram');
									// add marker
									canvas.addMarker(datas.taskDefinitionKey, 'highlight');
                 
              }
            });

          })
      })
    })
    this.allTasks();
  }
  public allTasks()
  {
     this.engine.taskCount().subscribe((res)=>{
      this.taskCount = res.count;
    })
    this.engine.myTask().subscribe((data)=>{
        let size=5;
        this.taskList = data.slice(0,4);
    })
  }
}
