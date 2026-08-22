<?php
namespace App\Http\Controllers;
use App\Models\User; use Illuminate\Http\RedirectResponse; use Illuminate\Http\Request; use Illuminate\Support\Facades\Auth; use Illuminate\Support\Facades\Hash; use Illuminate\View\View; use Illuminate\Validation\ValidationException;
class AuthController extends Controller {
 public function showLogin():View{return view('auth.login');} public function showRegister():View{return view('auth.register');}
 public function register(Request $request):RedirectResponse{$v=$request->validate(['name'=>['required','string','min:2','max:120'],'email'=>['required','email','max:255','unique:users,email'],'password'=>['required','confirmed','min:8']]);$u=User::create(['name'=>$v['name'],'email'=>$v['email'],'password'=>Hash::make($v['password'])]);Auth::login($u);$request->session()->regenerate();return to_route('dashboard')->with('success','Welcome to Workboard Access.');}
 public function login(Request $request):RedirectResponse{$v=$request->validate(['email'=>['required','email'],'password'=>['required','string'],'remember'=>['nullable','boolean']]);if(!Auth::attempt(['email'=>$v['email'],'password'=>$v['password']],(bool)($v['remember']??false)))throw ValidationException::withMessages(['email'=>'Those credentials do not match our records.']);$request->session()->regenerate();return to_route('dashboard');}
 public function logout(Request $request):RedirectResponse{Auth::logout();$request->session()->invalidate();$request->session()->regenerateToken();return to_route('login')->with('success','You have been securely signed out.');}
}
