<?php
namespace App\Http\Controllers;
use App\Http\Requests\TaskRequest; use App\Models\Task; use Illuminate\Http\RedirectResponse; use Illuminate\Http\Request; use Illuminate\View\View;
class TaskController extends Controller {
 public function index(Request $request):View{$q=Task::query();if($s=trim((string)$request->input('search'))) $q->where(fn($b)=>$b->where('title','like',"%$s%")->orWhere('description','like',"%$s%"));if($request->filled('status'))$q->where('status',$request->input('status'));if($request->filled('priority'))$q->where('priority',$request->input('priority'));return view('tasks.index',['tasks'=>$q->latest()->paginate(8)->withQueryString()]);}
 public function create():View{return view('tasks.form',['task'=>new Task,'mode'=>'create']);}
 public function store(TaskRequest $request):RedirectResponse{Task::create($request->validated());return to_route('tasks.index')->with('success','Task created successfully.');}
 public function show(Task $task):View{return view('tasks.show',compact('task'));}
 public function edit(Task $task):View{return view('tasks.form',compact('task')+['mode'=>'edit']);}
 public function update(TaskRequest $request,Task $task):RedirectResponse{$task->update($request->validated());return to_route('tasks.show',$task)->with('success','Task updated successfully.');}
 public function destroy(Task $task):RedirectResponse{$task->delete();return to_route('tasks.index')->with('success','Task deleted successfully.');}
}
