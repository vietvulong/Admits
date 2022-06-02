{{--@extends('layouts.dashboard')--}}
@section('css')
    <link rel="stylesheet" href="/resources/assets/sass/tableFilter.css">
    <!-- Bootstrap 3.3.6 -->
    <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="/resources/assets/css/tableFilterCustom.css">
   
@endsection

@section('content')
    <section id="intro">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12  text-center">
                    <h1>Instant access to 400,000+ admits & rejects!</h1>
                    <span class="tips"><img src="/resources/assets/image/profile_icon/idea@3x.png" class="tip" alt=""
                                            height="20" width="14"> <font size="3">Pro Tip: Click on a column header to filter and search through the data</font>
                    </span>
                    </br>
                    @if (!Auth::check())
                      <span class="tips"><img src="/resources/assets/image/profile_icon/idea@3x.png" class="tip" alt=""
                                              height="20" width="14"> <font size="3"><a href="https://cutt.ly/admits-pro" target="_blank">
                                  <u>Get Pro</u>
                          </a> for access to 2020 and 2021 results</font>
                      </span>
                    @else
                      <span class="tips">
                        <font size="3">
                          Enjoy your Pro access!
                        </font>
                      </span>
                    @endif
                </div>
            </div>
        </div>
    </section>

    <section id="table-page" ng-controller="TablePageCtrl" ng-cloak>
        {{--Sperate filter chips for easily maintainance--}}
        @include('table.filter_chips')
        <table id="tbl" st-table="displayedCollection" st-safe-src="filteredCollection"
               class="table table-bordered b-t">
            {{--Sperate table header for easily maintainance--}}
            @include('table.table_head')
            <tbody>

            <tr ng-if="loadingData">
                <td colspan="15" class="text-center">
                    <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66"
                         xmlns="http://www.w3.org/2000/svg">
                        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33"
                                r="30"></circle>
                    </svg>
                </td>
            </tr>
            <tr ng-if="!loadingData" ng-repeat="row in displayedCollection">
                <td>@{{row.University}}</td>
                <td><span ng-class="row.Status | lowercase" class="inner-table">@{{row.Status}}</span></td>
                <td>@{{row.Target_Major | na}}</td>
                <td>@{{row.Term}} @{{row.Year}}</td>
                <td class="text-right">@{{row.GRE_Q | na}}</td>
                <td class="text-right">@{{row.GRE_V | na}}</td>
                <td class="text-right">@{{row.GRE_AWA | na}}</td>
                <td class="text-right">@{{row.GRE_Total | na}}</td>
                <td class="text-right">@{{row.TOEFL === -1 ? row.IELTS : row.TOEFL | na}}</td>
                <td>@{{row.College_Main_Form | na}}</td>
                <td>@{{row.Undergrad_Major | na}}</td>
                <td class="text-right">@{{row.Grade | na}}</td>
                <td class="text-right">@{{row.Publications | na}}</td>
                <td class="text-right">@{{row.Work_Experience | na}} Mo</td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="16" class="text-center">
                    <ul uib-pagination total-items="pagination.total"
                        ng-model="pagination.current_page"
                        max-size="visiblePage"
                        items-per-page="pagination.per_page"
                        ng-change="pageChanged()"></ul>
                </td>
            </tr>
            </tfoot>
        </table>

        
        <script type="text/ng-template" id="limit-reached">
            <div class="modal fade">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content ">
                        <div class="modal-body text-center">
                            <h3>Per day limit reached. Please try again in 24 hours.</h3>
                        </div>
                    </div>
                </div>
            </div>
        </script>


        <script type="text/ng-template" id="smart-filter-modal">
            <div class="modal fade">
                <div class="modal-dialog modal-lg">
                    
                    <div class="modal-content ">
                        <div class="modal-header">
                            <h1 class="page-title text-center">Profile Evaluator</h1>    
                        </div>
                        <div class="modal-body">
                            <div class="form-group">

                                <div class="row" style="display:flex; flex-wrap:wrap; align-items:center;">
                                    <label class="col-md-3 col-md-offset-2 col-sm-3 col-xs-12">
                                                    <span>
                                                    <img class="profile-icon"
                                                        src="/resources/assets/image/profile_eveluator/notebook-copy@3x.png">
                                                        Target Major
                                                    </span>
                                    </label>
                                    <div class="col-md-5 col-sm-9 col-xs-12" id="major" class="major" is-open="majorOpen" auto-close="outsideClick" on-toggle="focusInput()">
                                            <input type="text" autocomplete="off" uib-typeahead="name for name in typeaheadMajor($viewValue)"
                                                placeholder="Enter a Major"
                                                typeahead-on-select="onMajorTypeAheadSelected($item, 'SMART')"
                                                typeahead-append-to="majorTypeAheadPos"
                                                typeahead-loading="isLoading"
                                                ng-model="typeAhead.target_major"
                                                class="form-control">
                                            
                                            <ul class="dropdown-menu dropdown-menu-left" ng-style="width:90% !important;" uib-dropdown-menu role="menu" aria-labelledby="single-button">
                                            
                                                <li class="divider"></li>
                                                <li ng-if="isLoading" class="text-center">Data is loading....</li>
                                                <li id="majorTypeAheadPos">
                                                </li>
                                            </ul>
                                        </ul>
                                        <span class="target_major-filter filter" ng-if="filterApplied.target_major"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="row" style="display:flex; flex-wrap:wrap; align-items:center;">
                                    <label class="col-md-3 col-md-offset-2 col-sm-3 col-xs-12">
                                                    <span class="control-label">
                                                    <img class="profile-icon"
                                                        src="/resources/assets/image/profile_eveluator/calendar@3x.png">
                                                        Term</span>
                                    </label>
                                    <div class="col-md-2 col-sm-4 col-xs-6 text-center">
                                        <button type="button" ng-class="smartBaseFilter.term != undefined && smartBaseFilter.term.indexOf('Fall')!=-1?'btn btn-block active':'btn btn-block'" id="btn-term-button" ng-click="chooseTerm('Fall')" >Fall</button>
                                    </div>
                                    <div class="col-md-2 col-sm-4 col-xs-6 text-center">
                                        <button type="button" ng-class="smartBaseFilter.term != undefined && smartBaseFilter.term.indexOf('Spring')!=-1?'btn btn-block active':'btn btn-block'" id="btn-term-button" ng-click="chooseTerm('Spring')">Spring</button>
                                    </div>
                                        
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="row" style="display:flex; flex-wrap:wrap; align-items:center;">
                                    <label class="col-md-3 col-md-offset-2 col-sm-4 col-xs-12">
                                                    <span class="control-label">
                                                    <img class="profile-icon"
                                                        src="/resources/assets/image/profile_eveluator/notebook-copy@3x.png"
                                                        alt="">
                                                    Undergrad Major</span>
                                    </label>
                                    <div class="col-md-5 col-sm-8 col-xs-12">
                                        <input type="text" autocomplete="off" uib-typeahead="name for name in typeaheadDepartment($viewValue)"
                                                    placeholder="Enter a department"
                                                    typeahead-on-select="onDepartmentTypeAheadSelected($item, 'SMART')"
                                                    typeahead-loading="isLoading"
                                                    typeahead-append-to="departmentTypeAheadPos"
                                                    ng-model="typeAhead.department"
                                                    class="form-control">
                                                
                                        <ul class="dropdown-menu dropdown-menu-left" style="width:90% !important;" uib-dropdown-menu role="menu" aria-labelledby="single-button">
                                        
                                            <li class="divider"></li>
                                            <li ng-if="isLoading" class="text-center">Data is loading....</li>
                                            <li id="departmentTypeAheadPos">
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="row" style="display:flex; flex-wrap:wrap;align-items:center;">
                                    <label class="col-md-3 col-md-offset-2 col-sm-4 col-xs-12">
                                                    <span class="control-label">
                                                    <img class="profile-icon"
                                                        src="/resources/assets/image/profile_eveluator/bookmark@3x.png"
                                                        alt="">
                                                    Undergrad Academics</span>
                                    </label>
                                    <div class="col-md-2 col-sm-4 col-xs-6 text-center">
                                        <span class="sub-label">Grade</span>
                                        <input class="form-control text-center"
                                            autocomplete="off"
                                            placeholder="Score"
                                            ng-model="smartBaseFilter.grade"
                                            name="grade"
                                            ng-change="smartBase_change_grade()"
                                            />
                                    </div>
                                    <div class="col-md-2 col-sm-4 col-xs-6 text-center">
                                        <span class="sub-label">Grade Scale</span>
                                        <input class="form-control text-center"
                                            autocomplete="off"
                                            ng-model="smartBaseFilter.grade_scale"
                                            name="grade_scale" disabled/>
                                    </div>
                                </div>
                            </div>

                            
                            <div class="form-group">
                                <div class="row" style="display: flex;align-items: center; flex-wrap:wrap;">
                                    <label class="col-md-3 col-md-offset-2 col-sm-4 col-xs-12">
                                                        <span class="control-label">
                                                        <img class="profile-icon" src="/resources/assets/image/profile_icon/earth-globe.png" alt="">
                                                            GRE Score</span>
                                    </label>
                                    <div class="col-md-2 col-sm-4 col-xs-6 text-center">
                                        <span class="sub-label">Verbal</span>
                                        <input class="form-control text-center" 
                                            autocomplete="off"
                                            min="130"
                                            max="170"
                                            range-error-message="Verbal must between 130 and 170"
                                            placeholder="Score" 
                                            ng-model="smartBaseFilter.gre_v" 
                                            name="verbal_score"
                                            
                                        >
                                        <div class="error-wrapper" style="width:100%; right:0px; " ng-if="smartBaseFilter.errors.gre_v">
                                            <div class="error-indicator " style="right:15px; top:-25px;">
                                                <i class="glyphicon glyphicon-exclamation-sign pull-right" style="color:#eb3f00 !important;"></i>
                                            </div>
                                            <div class="error-content" style="top:5px; right:15px;">
                                                <i class="fa fa-sort-asc"></i>
                                                <ul>
                                                    <li>Must be between 130-170</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-2 col-sm-4 col-xs-6 text-center">
                                        <span class="sub-label">Quant</span>
                                        <input class="form-control text-center" 
                                                autocomplete="off"
                                                min="130"
                                                max="170"
                                                placeholder="Score" 
                                                ng-model="smartBaseFilter.gre_q" name="quant_score">
                                            
                                        <div class="error-wrapper" style="width:100%; right:0px; " ng-if="smartBaseFilter.errors.gre_q">
                                            <div class="error-indicator " style="right:15px; top:-25px;">
                                                <i class="glyphicon glyphicon-exclamation-sign pull-right" style="color:#eb3f00 !important;"></i>
                                            </div>
                                            <div class="error-content" style="top:5px; right:15px;">
                                                <i class="fa fa-sort-asc"></i>
                                                <ul>
                                                    <li>Must be between 130-170</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            
                            <div style="margin-top:30px;"></div>
                            <div class="form-group">
                                <div class="row" style="display: flex;align-items: center;">

                                    <label class="col-md-3 col-md-offset-2 col-sm-4 col-xs-12">
                                         
                                        <span class="control-label">
                                        <img class="profile-icon" src="/resources/assets/image/profile_eveluator/book@3x.png"
                                                    alt="">
                                        TOEFL/IELTS Score</span>
                                    </label>
                                    <div class="col-md-2 col-sm-4 col-xs-6 text-center">
                                        <input class="form-control text-center" 
                                            autocomplete="off" 
                                            placeholder="Score" 
                                            ng-model="smartBaseFilter.eng_score" 
                                            name="English_Score">
                                        <div class="error-wrapper" style="width:100%; right:0px; " ng-if="smartBaseFilter.errors.eng_score">
                                                <div class="error-indicator " style="right:15px; top:-25px;">
                                                    <i class="glyphicon glyphicon-exclamation-sign pull-right" style="color:#eb3f00 !important;"></i>
                                                </div>
                                                <div class="error-content" style="top:5px; right:15px;">
                                                    <i class="fa fa-sort-asc"></i>
                                                    <ul>
                                                        <li>Must be between 0-120</li>
                                                    </ul>
                                                </div>
                                            </div>
                                    </div>
                                    
                                    
                                </div>
                            </div>
                            <div style="margin-top:30px;"></div>
                            <div class="form-group" style="text-align:center;">

                                <button class="btn btn-reset-filter" ng-click="smartFilterBtnClicked()" >
                                    Show Results
                                </button>
                            </div>
          
                        </div>
                    </div>
                </div>
            </div>
        </script>

        <div id="report" class="row justify-content-center">
          <p><br><br><br></p>
          <div class="col-sm-1"></div>
          <div class="col-sm-6">
            <a href="https://cutt.ly/pro_report_image" target="_blank"><img src="https://i.imgur.com/uHRMRMr.jpeg" class="img-fluid" width="70%" height="auto" border="0" /></a>
          </div>
          <div class="col-sm-4">
            <div>
              <h2>Find Universities You Deserve</h2><br>
              <div>
                <h4>Get a personalized & detailed evaluation report created by our special algorithm using 400K+ results (includes 2020 & 2021 data).</h4><br>
                <ul>  
                  <li>You will get universities in each category of (V. Safe, Safe, Moderate, Ambitious & V. Ambitious) along with Admit chances.</li>
                  <li>You will also get sample profiles that justify our predictions.</li>
                  <li>All reports are also reviewed by our expert team</li>
                </ul>
                <br>
                <h4>Level up your shortlisting like 100s of other students</h4>
              </div>
              <br><br>
              <a href="https://cutt.ly/pro_report_image" target="_blank" class="btn btn-add-result">GET YOUR REPORT</a>
              &nbsp;
              &nbsp;
              <a href="https://drive.google.com/file/d/1V3cofwu8HHlzypmIg0MvPsyC5GUDL-gy/view" target="_blank" class="btn btn-add-result">VIEW SAMPLE REPORT</a>
            </div>
          </div>
          <div class="col-sm-1"></div>
        </div>

        <div>
            <p><br><br></p>
            <div class="text-center">
                <h2>Students Love our Reports</h2>
                <br>
            </div>
            <script type="text/javascript" src="https://testimonial.to/js/iframeResizer.min.js"></script>
            <iframe id="testimonialto-admits-fyi-light" src="https://embed.testimonial.to/w/admits-fyi?theme=light&card=base" frameborder="0" scrolling="no" width="100%"></iframe>
            <script type="text/javascript">iFrameResize({log: false, checkOrigin: false}, "#testimonialto-admits-fyi-light");</script>

            <div id="testimonial">
              <script type="text/javascript" src="https://testimonial.to/js/iframeResizer.min.js"></script>
              <iframe id="testimonialto-c-admits-fyi-light" src="https://embed.testimonial.to/c/admits-fyi?theme=light" allow="camera;microphone" frameborder="0" scrolling="no" width="100%"></iframe>
              <script type="text/javascript">iFrameResize({log: false, checkOrigin: false}, "#testimonialto-c-admits-fyi-light");</script>
            <div>
            <p align="center">
                <iframe width="416" height="250" src="https://www.youtube.com/embed/D5_ZYoxOlrs" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </p>
        </div>
        
    </section>
    @if (session('top_univ_error'))
    <script>
        window.onload = function () {
            angular.element(document.getElementById('table-page')).scope().showPageError();
        }
    </script>
    @endif
    <script type="text/ng-template" id="page-error">
        <div class="modal fade">
            <div class="modal-dialog modal-lg">
                <div class="modal-content ">
                    <div class="modal-body text-center">
                        <h3>This is not preffered univeristy name.</h3>
                    </div>
                </div>
            </div>
        </div>
    </script>
    
@endsection