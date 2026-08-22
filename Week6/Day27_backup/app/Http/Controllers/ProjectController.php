<?php
namespace App\Http\Controllers;
use Illuminate\View\View;
class ProjectController extends Controller {
 public function home():View{return view('home',['stats'=>[['label'=>'Active initiatives','value'=>'08'],['label'=>'Delivery confidence','value'=>'94%'],['label'=>'Open actions','value'=>'17']]]);}
 public function show(string $project):View{$projects=['workboard'=>['name'=>'Workboard','stage'=>'Building','summary'=>'A focused task-management workspace for small teams.'],'client-portal'=>['name'=>'Client Portal','stage'=>'Planning','summary'=>'A secure portal for requests, updates and client communication.']];abort_unless(isset($projects[$project]),404);return view('project',['project'=>$projects[$project]]);}
 public function about():View{return view('about');}
}
