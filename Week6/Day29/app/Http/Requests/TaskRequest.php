<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class TaskRequest extends FormRequest { public function authorize():bool{return true;} public function rules():array{return ['title'=>['required','string','min:3','max:160'],'description'=>['nullable','string','max:3000'],'status'=>['required','in:todo,in_progress,done'],'priority'=>['required','in:low,normal,high'],'due_date'=>['nullable','date']];} }
