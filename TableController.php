<?php
/**
 * Created by IntelliJ IDEA.
 * User: dinhn_000
 * Date: 7/20/2016
 * Time: 09:56
 */

namespace App\Http\Controllers;


use App\University;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;
use JavaScript;

class TableController extends Controller
{

    const FREE_YEAR_LIMIT = '2019';

    public function index()
    {
        return view('table.index', ['universities' => University::all()]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function filter(Request $request)
    {
        $currentPage = LengthAwarePaginator::resolveCurrentPage();
        $perPage = 10;
        $limit = 100;

        $result = DB::table('admits')->limit($limit);
        if (!Auth::check()) {
            // The user is not Pro user
            $result = $result->where('year', '<=', self::FREE_YEAR_LIMIT);
        } else {
            $user = Auth::user();
            // Check if subscription is active
            if ($user != null && $user->subscription_active == 0) {
                // Log out user and redirect to home page
                Auth::logout();
                return redirect('/');
            }
        }
        if ($request->has('init')) {
            $tracking_id = $this->startTableFilterTracking(self::logSQLQuery($result), 'table-filter-init');
            $result = $result->get();
            $result = collect($result);

            $paginate = new LengthAwarePaginator(
                $result->forPage($currentPage, $perPage),
                $result->count(),
                $perPage,
                $currentPage,
                ['path'  => url()->current()]
            );
            return response(array(
                'pagination' => $paginate, 'tracking_id' => $tracking_id
            ));
        } else {
            
            
            if ($request->has('university')) {
                $result->where('University', '=', $request->get('university'));
            }

            if ($request->has('status') && count($request->get('status')) > 0) {
                $result->whereIn('Status', $request->get('status'));
            }

            if ($request->has('target_major')) {
                $result->where('Target_Major', '=', $request->get('target_major'));
            }

            if ($request->has('term') && count($request->get('term')) > 0) {
                $result->whereIn('Term', $request->get('term'));
            }

            if ($request->has('year')) {
                $result->whereBetween('Year', $request->get('year'));
            }

            if ($request->has('gre_q')) {
                $result->whereBetween('GRE_Q', $request->get('gre_q'));
            }

            if ($request->has('gre_v')) {
                $result->whereBetween('GRE_V', $request->get('gre_v'));
            }

            if ($request->has('gre_awa')) {
                $result->whereBetween('GRE_AWA', $request->get('gre_awa'));
            }

            if ($request->has('gre_total')) {
                $result->whereBetween('GRE_Total', $request->get('gre_total'));
            }

            if ($request->has('college')) {
                $result->where('College_Main_Form', '=', $request->get('college'));
            }

            if ($request->has('department')) {
                $result->where('Undergrad_Major', '=', $request->get('department'));
            }

            if ($request->has('grade')) {
                $result->whereBetween('Grade', $request->get('grade'));
            }

            if ($request->has('grade_scale') && count($request->get('grade_scale')) > 0) {
                $result->whereIn('Grade_Scale', $request->get('grade_scale'));
            }

            if ($request->has('eng')) {
                $engScore = $request->get('eng');
                if ($request->has('eng_scale') && count($request->get('eng_scale')) > 0) {
                    if (count($request->get('eng_scale')) == 2) {
                        $result->where(function ($query) use ($engScore) {
                            $query->whereBetween('IELTS', $engScore)->orWhereBetween('TOEFL', $engScore);
                        });
                    } else if ($request->get('eng_scale')[0] == 9) {
                        $result->whereBetween('IELTS', $engScore);
                    } else {
                        $result->whereBetween('TOEFL', $engScore);
                    }
                } else {
                    $result->where(function ($query) use ($engScore) {
                        $query->whereBetween('IELTS', $engScore)->orWhereBetween('TOEFL', $engScore);
                    });
                }
            }


            if ($request->has('publications')) {
                $result->whereBetween('Publications', $request->get('publications'));
            }

            if ($request->has('work_exp')) {
                $result->whereBetween('Work_Experience', $request->get('work_exp'));
            }
            $tracking_id = $this->startTableFilterTracking(self::logSQLQuery($result), 'table-filter');
            $result = $result->get();
            $result = collect($result);

            $paginate = new LengthAwarePaginator(
                $result->forPage($currentPage, $perPage),
                $result->count(),
                $perPage,
                $currentPage,
                ['path'  => url()->current()]
            );
            return response(array('result' => $paginate, 'tracking_id' => $tracking_id));
        }
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function typeAhead(Request $request)
    {
        $key = $request->get('key');
        switch ($key) {
            case 'University':
                return University::with('detail')->where('name', 'like', '%' . $request->get('value') . '%')->get();
                break;
            case 'Target_Major':
                return DB::table('TargetMajor')->where('Target_Major', 'like', '%' . $request->get('value') . '%')->orderBy('count', 'desc')->get();
                break;
            case 'College':
                return DB::table('College')->where('university', 'like', '%' . $request->get('value') . '%')->get();
                break;
            case 'Department':
                return DB::table('UndergradMajor')->where('College', 'like', '%' . $request->get('value') . '%')->orderBy('count', 'desc')->get();
                break;
            default:
                return false;

        }
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function exist(Request $request)
    {
        $key = $request->get('key');
        switch ($key) {
            case 'University':
                return is_null(DB::table('University')->where('name', '=', $request->get('value'))->first()) ? 'false' : 'true';
                break;
            case 'Target_Major':
                return is_null(DB::table('TargetMajor')->where('Target_Major', '=', $request->get('value'))->first()) ? 'false' : 'true';
                break;
            case 'College':
                return is_null(DB::table('College')->where('university', '=', $request->get('value'))->first()) ? 'false' : 'true';
                break;
            case 'Department':
                return is_null(DB::table('UndergradMajor')->where('College', '=', $request->get('value'))->first()) ? 'false' : 'true';
                break;
            default:
                return false;
        }
    }

    public function IndividualUniv(Request $request) {
        $name = $request->name;
        
        $name = str_replace('-', ' ', $name);
        $university= $request->university;


        
        $flag = 0;
        
        $univArrays = Config::get('custom.available_univ_names');
        
        if($univArrays[0] == "*") {
            $universites = University::all();
            foreach($universites as $univ) {
                if($univ->name == $name)
                    $flag =1;
            }
        }
        else {
            $universites = University::take(Config::get('custom.top_univ_select'))->get();
            foreach($universites as $univ) {
                if($univ->name == $name)
                    $flag =1;
            }
            foreach($univArrays as $uName) {
                if($uName == $name)
                    $flag = 1;
            }
        }
        if($flag == 0) {
            return back()->with('top_univ_error', 'univ error');
        }

        if( isset($university) != NULL) {
            return view('table.index',['tag_name' => $name]);
        }
        $url = url()->current()."?university=".$name;
        return redirect()->to($url);
    }
    
}
