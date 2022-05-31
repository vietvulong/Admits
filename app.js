angular.module('mainApp', ['ui.bootstrap', 'smart-table', 'ngToast', 'ui.bootstrap-slider', 'angular-spinkit', 'angular.vertilize',
    'validation', 'validation.rule', 'angularUtils.directives.dirPagination', 'angularModalService', 'monospaced.elastic',
    'checklist-model', 'xeditable', 'ngFileUpload', 'angular-progress-arc', 'mgo-angular-wizard', 'angular-svg-round-progressbar'])
    .config(['$validationProvider', 'paginationTemplateProvider','msdElasticConfig', function ($validationProvider, paginationTemplateProvider,msdElasticConfig) {
        // msdElasticConfig.append = '\n';
        $validationProvider.showSuccessMessage = false;
        $validationProvider.setValidMethod('submit-only');
        $validationProvider
            .setExpression({
                none: function (value, scope, element, attrs, param) {
                    return true;
                },
                awa: function (value, scope, element, attrs, param) {
                    if (value == attrs.oldVal || value == null) {
                        return true;
                    }
                    var patt = new RegExp(/^([0-5](\.5)?$)|^6$/);
                    return patt.test(value);

                },
                ielts: function (value, scope, element, attrs, param) {
                    if (value == attrs.oldVal || value == null) {
                        return true;
                    }
                    var patt = new RegExp(/^([0-8](\.5)?$)|^9$/);
                    return patt.test(value);

                },
                grade4: function (value, scope, element, attrs, param) {
                    if (value == attrs.oldVal || value == null) {
                        return true;
                    }
                    var patt = new RegExp(/^([0-3](\.\d{1,2})?$)|^4$/);
                    return patt.test(value);

                },
                grade10: function (value, scope, element, attrs, param) {
                    if (value == attrs.oldVal || value == null) {
                        return true;
                    }
                    var patt = new RegExp(/^\d(\.\d{1,2})?$/);
                    return patt.test(value);

                },
                grade100: function (value, scope, element, attrs, param) {
                    if (value == attrs.oldVal || value == null) {
                        return true;
                    }
                    var patt = new RegExp(/^\d{1,2}(\.\d{1,2})?$/);
                    return patt.test(value);

                },
                range: function (value, scope, element, attrs, param) {
                    // If value is not edited then don't validate it
                    if (value == attrs.oldVal || value == null) {
                        return true;
                    }

                    // Otherwise validate data field
                    if (value >= parseInt(attrs.min) && value <= parseInt(attrs.max)) {
                        return value;
                    }
                },
                numberNull: function (value, scope, element, attrs, param) {
                    if (value == attrs.oldVal || value == null) {
                        return true;
                    }
                    var patt = new RegExp(/^\d+$/);
                    return patt.test(value);
                },
                ajax: function (value, scope, element, attrs, param) {
                    // If value is not edited then don't validate it
                    if (value == attrs.oldVal || value == null) {
                        return true;
                    }

                    switch (attrs.validatorField) {
                        case "University":
                            return _.indexOf(uni, value) != -1;
                        case "Target_Major":
                            return _.indexOf(target_major, value) != -1;
                        case "College":
                            return _.indexOf(under_uni, value) != -1;
                        case "Department":
                            return _.indexOf(under_major, value) != -1;
                        default:
                            return false;
                    }
                }
            })
            .setDefaultMsg({
                required: {
                    error: 'Required',
                    success: 'good'
                },
                awa: {
                    error: 'Must be a float number',
                    success: 'good'
                },
                ielts: {
                    error: 'Must between 0 and 9',
                    success: 'good'
                },
                grade4: {
                    error: 'Must be between 0 and 4',
                    success: 'good'
                },
                grade10: {
                    error: 'Must be between 0 and 10',
                    success: 'good'
                },
                grade100: {
                    error: 'Must be between 0 and 100',
                    success: 'good'
                },
                numberNull: {
                    error: "Must be a number",
                    success: 'good'
                },
                range: {
                    error: 'Number should be between: ',
                    success: 'good'
                },
                ajax: {
                    error: 'This field is invalid',
                    success: 'good'
                }
            });

        $validationProvider.setErrorHTML(function (msg, element, attrs) {
            return ' <div class="error-wrapper">' +
                '                <div class="error-indicator ">' +
                '                <i class="glyphicon glyphicon-exclamation-sign pull-right"></i>' +
                '                </div>' +
                '                <div class="error-content">' +
                '                <i class="fa fa-sort-asc"></i>' +
                '                <ul>' +
                '                <li>' + msg + '</li>' +
                '            </ul>' +
                '            </div>' +
                '            </div>';
        });

        paginationTemplateProvider.setPath('/resources/template/pagination-indicator.html');
    }])
    .directive('updateImage', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$on('profileImageChanged', function (event, args) {
                    element.attr("src", args.image_src);
                });
            }
        }
    })
    .directive('toggleClass', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    var container = element.parentsUntil('.university-item').parent();
                    container.toggleClass(attrs.toggleClass);
                });
            }
        }
    })
    .controller('MainCtrl', function ($scope, $http) {

        /**
         * Type ahead university
         * @returns {*}
         */

        $scope.typeaheadUniversity = function (val) {
            $scope.isLoading = true;
            return $http.get('/cgi-bin/ahead_university.py?value=' + val)
                .then(function (response) {
                    return response.data.map(function (item) {
                        return item.university;
                    });
                });
        };

        /**
         * Type ahead Major
         * @returns {*}
         */
        $scope.typeaheadMajor = function (val) {
            $scope.isLoading = true;
            return $http.post('public/typeahead', {
                key: 'Target_Major',
                value: val
            }).then(function (response) {
                return response.data.map(function (item) {
                    return item.Target_Major;
                });
            });
        };


        /**
         * Type ahead College
         * @returns {*}
         */
        $scope.typeaheadCollege = function (val) {
            $scope.isLoading = true;
            return $http.get('/cgi-bin/ahead_college.py?value=' + val).then(function (response) {
                return response.data.map(function (item) {
                    return item.university;
                });
            });
        };

        /**
         * Type ahead Department or Undergraded Major
         * @returns {*}
         */
        $scope.typeaheadDepartment = function (val) {
            $scope.isLoading = true;
            return $http.post('/typeahead', {
                key: 'Department',
                value: val
            }).then(function (response) {
                return response.data.map(function (item) {
                    return item.College;
                });
            });
        };

        /**
         * Auto hide error message if any when focus into input
         * @param $event
         */
        $scope.hideError = function ($event) {
            $($event.target).next().empty();
        };
    })

    .controller('ProfilePageCtrl', function ($scope, ngToast) {
        $('.center').css('min-height', $('#profile-page').height());
    })
    .controller('TablePageCtrl', function ($scope, $http, $timeout, $injector,ModalService, $window) {
        // $scope.universityOpen = false;
        /**
         * Main data loading flag
         * @type {boolean}
         */
        $scope.loadingData = true;
        /**
         * Type ahead loading flag
         * @type {boolean}
         */
        $scope.isLoading = false;
        $scope.visiblePage = 5;

        $scope.$validationProvider = $injector.get('$validation');

        /**
         * Default list based filter
         * @type {{year, result: string[], term: string[]}}
         */
        $scope.listBasedFilter = {
            'status': ['Admit', 'Reject'],
            'term': ['Spring', 'Fall'],
            'grade_scale': [4, 10, 100],
            'eng_scale': [9, 120],
            "year":[2006, 2019],
        };

        $scope.smartBaseFilter = {
            'eng_type':"",
            'gre_taken':false,
            'english_taken':false,
        }

        $scope.typeAhead = {};
        /**
         * Filtered data term
         * @type {{}}
         */
        $scope.filterApplied = {};

        /**
         * Default | Seed data displayed
         * @type {Array}
         */
        $scope.displayedCollection = [];

        /**
         * Filtered data display
         * @type {Array}
         */
        $scope.filteredCollection = [];

        /**
         * Type ahead university
         * @returns {*}
         */
        $scope.typeaheadUniversity = function (val) {
            $scope.isLoading = true;
            return $http.get('/cgi-bin/ahead_university.py?value=' + val).then(function (response) {
                return response.data.map(function (item) {
                    return item.university
                });
            });
        };

        /**
         * onUniversityTypeAheadSelected
         * @param $item
         * @param $model
         * @param $label
         * @param $event
         */
        $scope.onUniversityTypeAheadSelected = function ($item, $model, $label, $event) {
            $scope.filterApplied.university = $item;
            // $scope.universityOpen = false;
        };

        /**
         * Type ahead Major
         * @returns {*}
         */
        $scope.typeaheadMajor = function (val) {
            $scope.isLoading = true;
            return $http.post('/typeahead', {
                key: 'Target_Major',
                value: val
            }).then(function (response) {
                return response.data.map(function (item) {
                    return item.Target_Major;
                });
            });
        };


        /**
         * onMajorTypeAheadSelected
         * @param $item
         * @param isType //Smart or list based
         */
        $scope.onMajorTypeAheadSelected = function ($item,$mode ) {
            if($mode=="SMART") {
                $scope.smartBaseFilter.target_major = $item;
            }
            else {
                $scope.filterApplied.target_major = $item;
                $scope.majorOpen = false;
            }
        };

        $scope.onMajorTypeAheadChanged = function ( event) {
            console.log(event);
        };
        /**
         * Type ahead College
         * @returns {*}
         */
        $scope.typeaheadCollege = function (val) {
            $scope.isLoading = true;
            return $http.get('/cgi-bin/ahead_college.py?value=' + val).then(function (response) {
                return response.data.map(function (item) {
                    return item.university;
                });
            });
        };
        /**
         * onCollegeTypeAheadSelected
         * @param $item
         * @param $model
         * @param $label
         * @param $event
         */
        $scope.onCollegeTypeAheadSelected = function ($item, $model, $label, $event) {
            $scope.filterApplied.college = $item;
            $scope.collegeOpen = false;

        };

        /**
         * Type ahead Department or Undergraded Major
         * @returns {*}
         */
        $scope.typeaheadDepartment = function (val) {
            $scope.isLoading = true;
            return $http.post('/typeahead', {
                key: 'Department',
                value: val
            }).then(function (response) {
                return response.data.map(function (item) {
                    return item.College;
                });
            });
        };

        /**
         * onDepartmentTypeAheadSelected
         * @param $item
         * @param $model
         * @param $label
         * @param $event
         */
        $scope.onDepartmentTypeAheadSelected = function ($item, $mode) {
            if($mode=="SMART") {
                $scope.smartBaseFilter.department = $item;
            }
            else {
                $scope.filterApplied.department = $item;
                $scope.departmentOpen = false;
            }
        };


        function updateQueryStringParameter(uri, key, value) {
          var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
          var separator = uri.indexOf('?') !== -1 ? "&" : "?";
          if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
          }
          else {
            return uri + separator + key + "=" + value;
          }
        }
        /**
         * Fetching new data from remote server
         */
        $scope.queryFilteredResult = function (val) {

            $scope.loadingData = true;
            stopTracking();

            let url = new URL(window.location.origin);
            const hrefURL = window.location.href;
            if(hrefURL.match("/university/") && 'university' in $scope.filterApplied)
                url = new URL(window.location.href);

            if('university' in $scope.filterApplied) {
              url.searchParams.set('university', $scope.filterApplied.university);
            }
            else url.searchParams.delete("university"); 
            if('status' in $scope.filterApplied && $scope.filterApplied.status.length > 0) {
                url.searchParams.set('status', $scope.filterApplied.status);
            }
            else url.searchParams.delete("status"); 
            if('target_major' in $scope.filterApplied) {
                url.searchParams.set('target_major', $scope.filterApplied.target_major);
            }
            else url.searchParams.delete("target_major"); 
            if('term' in $scope.filterApplied && $scope.filterApplied.term.length > 0) {
                url.searchParams.set('term', $scope.filterApplied.term);
            }
            else url.searchParams.delete("term"); 
            if('year' in $scope.filterApplied) {
                url.searchParams.set('year', JSON.stringify($scope.filterApplied.year));
            }
            else url.searchParams.delete("year"); 
            if('gre_q' in $scope.filterApplied) {
                url.searchParams.set('gre_q', JSON.stringify($scope.filterApplied.gre_q));
            }
            else url.searchParams.delete("gre_q"); 
            if('gre_v' in $scope.filterApplied) {
                url.searchParams.set('gre_v', JSON.stringify($scope.filterApplied.gre_v));
            }
            else url.searchParams.delete("gre_v"); 
            if('gre_total' in $scope.filterApplied) {
              url.searchParams.set('gre_total', JSON.stringify($scope.filterApplied.gre_total));
            }
            else url.searchParams.delete("gre_total"); 
            if('eng' in $scope.filterApplied) {
              url.searchParams.set('eng', JSON.stringify($scope.filterApplied.eng));
            }
            else url.searchParams.delete("eng"); 
            if('eng_scale' in $scope.filterApplied) {
              url.searchParams.set('eng_scale', JSON.stringify($scope.filterApplied.eng_scale));
            }
            else url.searchParams.delete("eng_scale"); 
            if('college' in $scope.filterApplied) {
                url.searchParams.set('college', $scope.filterApplied.college);
            }
            else url.searchParams.delete("college"); 
            if('department' in $scope.filterApplied) {
                url.searchParams.set('department', $scope.filterApplied.department);
            }
            else url.searchParams.delete("department"); 
            if('grade' in $scope.filterApplied) {
                url.searchParams.set('grade', JSON.stringify($scope.filterApplied.grade));
            }
            else url.searchParams.delete("grade"); 
            if('grade_scale' in $scope.filterApplied) {
                url.searchParams.set('grade_scale', JSON.stringify($scope.filterApplied.grade_scale));
            }  
            else url.searchParams.delete("grade_scale"); 
            if('publications' in $scope.filterApplied) {
                url.searchParams.set('publications', JSON.stringify($scope.filterApplied.publications));
            }
            else url.searchParams.delete("publications"); 
            if('work_exp' in $scope.filterApplied) {
              url.searchParams.set('work_exp', JSON.stringify($scope.filterApplied.work_exp));
            }
            else url.searchParams.delete("work_exp"); 
            history.pushState('', '', url);

            //console.log(url.searchParams.get("status"));
            
            $http.post('/filter', $scope.filterApplied)
                .success(function (response) {
                    $scope.loadingData = false;
                    $scope.filteredCollection = response.result.data;
                    $scope.pagination = response.result;
                    $scope.current_tracking_id = response.tracking_id;
                })
                .error(function (response, data, headers) {
                    $scope.showLimitReachedModal();

                    // window.location.reload();
                });
        };

        /**
         * When a filter is applied1
         */
        $scope.$watch('filterApplied', function (newVal, oldVal) {
            if (!_.isEqual(newVal, oldVal)) {
                $scope.queryFilteredResult();
            }
        }, true);

        $scope.$watch('typeAhead', function(newVal, oldVal) {
            if(!newVal.target_major) {
                let smartBaseFilter = { ...$scope.smartBaseFilter };
                delete smartBaseFilter.target_major;
                $scope.smartBaseFilter = { ...smartBaseFilter };
            }
            if(!newVal.department) {
                let smartBaseFilter = { ...$scope.smartBaseFilter };
                delete smartBaseFilter.department;
                $scope.smartBaseFilter = { ...smartBaseFilter };
                
            }
        }, true);


        /**
         * Pagination changed
         */
        $scope.pageChanged = function (val) {
            $scope.loadingData = true;
            stopTracking();
            $http.post('/filter?page=' + $scope.pagination.current_page, $scope.filterApplied).success(function (response) {
                $scope.loadingData = false;
                $scope.displayedCollection = response.result.data;//changed from filteredCollection for manual pagination
                $scope.pagination = response.result;
                $scope.current_tracking_id = response.tracking_id;
            }).error(function (response, data, headers) {
                $scope.showLimitReachedModal();
            });
        };


        function getMatchedURL(param, min, max) {
            var splites = param.trim().split(',');
            if(splites.length == 2) {
                var startYear = splites[0].slice(1, splites[0].length);
                var lastYear = splites[1].slice(0, splites[1].length - 1);

                startYear = parseInt(startYear) < min ? min.toString(): parseInt(startYear) > max ? max.toString():startYear;
                lastYear = parseInt(lastYear) < min ? min.toString(): parseInt(lastYear) > max ? max.toString():lastYear;
                if(parseInt(startYear) > parseInt(lastYear)) lastYear = startYear;

                var params = "[" + startYear + "," + lastYear + "]";

                return params;
                
            }
            return "false";
        }


        $scope.showPageError = function () {
            ModalService.showModal({
                templateUrl: "page-error",
                controller: function ($scope, close) {
                }
            }).then(function (modal) {
                modal.element.modal();
            });
        };

        /**
         * Load filters from URL parameters if available.
         */

        var url = new URL(window.location.href);
        var searchParams = url.searchParams;
        var base_init = {'init': true};

        if(searchParams.has('university'))
        {
            var regex = /^[a-zA-z0-9, ]+$/;
            if(regex.test(searchParams.get('university'))) {
                $scope.filterApplied.university = searchParams.get('university');
                base_init = $scope.filterApplied;
            }
            else {
                searchParams.delete("university");
            }
        }
        if(searchParams.has('status')) {
            if(searchParams.get('status') == "Admit" || searchParams.get('status') == 'Reject')
            {
                $scope.filterApplied.status = [searchParams.get('status')];
                base_init = $scope.filterApplied;
            }
            else if(searchParams.get('status') =='Admit,Reject') {
                $scope.filterApplied.status = ["Admit", "Reject"];
                base_init = $scope.filterApplied;
            }
            else {
                searchParams.delete("status");
            }
        }
        if(searchParams.has('target_major')) {
        
            var regex = /^[a-zA-z0-9 ]+$/;
            if(regex.test(searchParams.get('target_major'))) {
                $scope.filterApplied.target_major = searchParams.get('university');
                base_init = $scope.filterApplied;
            }
            else {
                searchParams.delete("target_major");
            }
        }
        if(searchParams.has('term')) {
            if(searchParams.get('term') == "Spring" || searchParams.get('term') == 'Fall')
            {
                $scope.filterApplied.term = [searchParams.get('term')];
                base_init = $scope.filterApplied;
            }
            else if(searchParams.get('term') =='Spring,Fall') {
                $scope.filterApplied.term = ["Spring", "Fall"];
                base_init = $scope.filterApplied;
            }
            else {
                searchParams.delete("term");
            }
        }
        if(searchParams.has('year')) {
            var params = getMatchedURL(searchParams.get('year'), 2006, 2021);
            if(params !="false") {
                $scope.filterApplied.year = JSON.parse(params);
                searchParams.set('year', params);
                base_init = $scope.filterApplied;
            }
            else {
                searchParams.delete("year");
            }
            
          }
        if(searchParams.has('gre_q')) {
            var params = getMatchedURL(searchParams.get('gre_q'), 130, 170);
            if(params !="false") {
                $scope.filterApplied.gre_q = JSON.parse(params);
                searchParams.set('gre_q', params);
                base_init = $scope.filterApplied;
            }
            else {
                searchParams.delete("gre_q");
            }
        }
        if(searchParams.has('gre_v')) {
            var params = getMatchedURL(searchParams.get('gre_v'), 130, 170);
            if(params !="false") {
                $scope.filterApplied.gre_v = JSON.parse(params);
                searchParams.set('gre_v', params);
                base_init = $scope.filterApplied;
            }
            else {
                searchParams.delete("gre_v");
            }
        }
        if(searchParams.has('gre_total')) {
            var params = getMatchedURL(searchParams.get('gre_total'), 260, 340);
            if(params !="false") {
                $scope.filterApplied.gre_total = JSON.parse(params);
                searchParams.set('gre_total', params);
                base_init = $scope.filterApplied;
            }
            else {
                searchParams.delete("gre_total");
            }
        }

        if(searchParams.has('eng')) {
            var params = getMatchedURL(searchParams.get('eng'), 0, 10);
            if(params !="false") {
                $scope.filterApplied.eng = JSON.parse(params);
                searchParams.set('eng', params);
                base_init = $scope.filterApplied;
            }
            else {
                searchParams.delete("eng");
            }
          }
        if(searchParams.has('eng_scale')) {
            var params = getMatchedURL(searchParams.get('eng_scale'), 9, 120);
            if(params !="false") {
                $scope.filterApplied.eng_scale = JSON.parse(params);
                searchParams.set('eng_scale', params);
                base_init = $scope.filterApplied;
            }
            else {
                searchParams.delete("eng_scale");
            }
        }
        

        if(searchParams.has('college')) {
            var regex = /^[a-zA-z0-9 ]+$/;
            if(regex.test(searchParams.get('college'))) {
                $scope.filterApplied.college = searchParams.get('college');
                base_init = $scope.filterApplied;
            }
            else {
                searchParams.delete("college");
            }
        }
        if(searchParams.has('department')) {
            var regex = /^[a-zA-z0-9 ]+$/;
            if(regex.test(searchParams.get('department'))) {
                $scope.filterApplied.department = searchParams.get('department');
                base_init = $scope.filterApplied;
            }
            else {
                searchParams.delete("department");
            }
        }
        if(searchParams.has('grade')) {
            var params = getMatchedURL(searchParams.get('grade'), 0, 10);
            if(params !="false") {
                $scope.filterApplied.grade = JSON.parse(params);
                searchParams.set('grade', params);
                base_init = $scope.filterApplied;
            }
            else {
                searchParams.delete("grade");
            }
        }
        if(searchParams.has('grade_scale')) {
            $scope.filterApplied.grade_scale = JSON.parse(searchParams.get('grade_scale'));
            base_init = $scope.filterApplied;
        }
        
        if(searchParams.has('publications')) {
            var params = getMatchedURL(searchParams.get('publications'), 0, $scope.maxPublication);
            if(params !="false") {
                $scope.filterApplied.publications = JSON.parse(params);
                searchParams.set('publications', params);
                base_init = $scope.filterApplied;
            }
            else {
                searchParams.delete("publications");
            }
        }

        if(searchParams.has('work_exp')) {
            var params = getMatchedURL(searchParams.get('work_exp'), 0, $scope.maxPublication);
            if(params !="false") {
                $scope.filterApplied.work_exp = JSON.parse(params);
                searchParams.set('work_exp', params);
                base_init = $scope.filterApplied;
            }
            else {
                searchParams.delete("work_exp");
            }
        }
        
        history.pushState('', '', url);
        $http.post('/filter', base_init).success(function (response) {
            $scope.loadingData = false;
            if('init' in base_init) {
              // This is default data view
              $scope.displayedCollection = response.pagination.data;
              $scope.pagination = response.pagination;
            } else {
              // Filtered view
              $scope.filteredCollection = response.result.data;
              $scope.pagination = response.result;
            }
            $scope.maxWorkExp = 100;
            $scope.maxPublication = 10;
            $scope.current_tracking_id = response.tracking_id;
        }).error(function (response) {
            
            $scope.showLimitReachedModal();
        });

        /**
         * Function to remove the filter chip
         */
        $scope.removeFilterChip = function (filter, removeVal) {
            switch (filter) {
                case "University":
                    delete $scope.filterApplied.university;
                    break;
                case "Status":
                    $scope.listBasedFilter.status.splice(removeVal, 1);
                    $scope.filterApplied.status.splice(removeVal, 1);
                    if ($scope.filterApplied.status.length == 0) {
                        $scope.listBasedFilter.status = ['Admit', 'Reject'];
                        delete $scope.filterApplied.status;
                    }
                    break;
                case "Major":


                    // delete $scope.listBasedFilter.target_major;
                    delete $scope.filterApplied.target_major;
                    break;
                case "Term":
                    $scope.listBasedFilter.term.splice(removeVal, 1);
                    $scope.filterApplied.term.splice(removeVal, 1);
                    if ($scope.filterApplied.term.length == 0) {
                        $scope.listBasedFilter.term = ['Fall', 'Spring'];
                        delete $scope.filterApplied.term;
                    }
                    break;
                case "Year":
                    $scope.listBasedFilter.year = [2006, 2021];
                    delete $scope.filterApplied.year;

                    break;
                case "Quant":
                    $scope.listBasedFilter.gre_q = [130, 170];
                    delete $scope.filterApplied.gre_q;
                    break;
                case "Verbal":
                    $scope.listBasedFilter.gre_v = [130, 170];
                    delete  $scope.filterApplied.gre_v;
                    break;
                case "AWA":
                    $scope.listBasedFilter.gre_awa = [0, 6];
                    delete $scope.filterApplied.gre_awa;
                    break;
                case "Total":
                    $scope.listBasedFilter.gre_total = [260, 340];
                    delete $scope.filterApplied.gre_total;
                    break;
                case "Eng":
                    delete $scope.filterApplied.eng;
                    delete $scope.filterApplied.eng_scale;
                    $scope.listBasedFilter.eng_scale = [9, 120];
                    break;
                case "College":
                    // delete $scope.listBasedFilter.college;

                    delete $scope.filterApplied.college;
                    break;
                case "Department":
                    // delete $scope.listBasedFilter.department;

                    delete $scope.filterApplied.department;
                    break;
                case "Grade":
                    // $scope.listBasedFilter.grade = [0, 4 * $scope.grade_scale];
                    delete  $scope.filterApplied.grade;
                    delete $scope.filterApplied.grade_scale;
                    $scope.listBasedFilter.grade_scale = [4, 10, 100];
                    break;
                case "Publications":
                    $scope.listBasedFilter.publications = [0, $scope.maxPublication];
                    delete $scope.filterApplied.publications;
                    break;
                case "Work_Exp":
                    $scope.listBasedFilter.work_exp = [0, $scope.maxWorkExp];
                    delete $scope.filterApplied.work_exp;
                    break;
            }
        };

        /**
         *
         * @param filter
         * @param value
         */
        $scope.onFilterApplied = function (filter, value) {
            
            switch (filter) {
                case "University":
                    $scope.universityOpen = false;
                    break;
                case "Status":
                    $scope.statusOpen = false;
                    $scope.filterApplied.status = [];
                    angular.forEach($scope.listBasedFilter.status, function (item, value) {
                        $scope.filterApplied.status.push(item);
                    });
                    break;
                case "Major":
                    $scope.majorOpen = false;
                    break;
                case "Term":
                    $scope.termOpen = false;
                    $scope.filterApplied.year = $scope.listBasedFilter.year;
                    $scope.filterApplied.term = [];
                    angular.forEach($scope.listBasedFilter.term, function (item, value) {
                        $scope.filterApplied.term.push(item);
                    });
                    // $scope.filterApplied.term = $scope.listBasedFilter.term;
                    break;
                case "Quant":
                    $scope.quantOpen = false;
                    $scope.filterApplied.gre_q = $scope.listBasedFilter.gre_q;
                    break;
                case "Verbal":
                    $scope.verbalOpen = false;
                    $scope.filterApplied.gre_v = $scope.listBasedFilter.gre_v;
                    break;
                case "AWA":
                    $scope.awaOpen = false;
                    $scope.filterApplied.gre_awa = $scope.listBasedFilter.gre_awa;
                    break;
                case "Total":
                    $scope.totalOpen = false;
                    $scope.filterApplied.gre_total = $scope.listBasedFilter.gre_total;
                    break;
                case "Eng":
                    $scope.engOpen = false;
                    $scope.filterApplied.eng = $scope.listBasedFilter.eng;
                    $scope.filterApplied.eng_scale = [];
                    angular.forEach($scope.listBasedFilter.eng_scale, function (item, value) {
                        $scope.filterApplied.eng_scale.push(item);
                    });
                    break;
                case "College":
                    $scope.collegeOpen = false;
                    break;
                case "Department":
                    $scope.departmentOpen = false;
                    break;
                case "Grade":
                    $scope.gradeOpen = false;
                    $scope.filterApplied.grade = $scope.listBasedFilter.grade;
                    $scope.filterApplied.grade_scale = [];
                    angular.forEach($scope.listBasedFilter.grade_scale, function (item, value) {
                        $scope.filterApplied.grade_scale.push(item);
                    });
                    break;
                case "Publications":

                    $scope.publicationsOpen = false;
                    $scope.filterApplied.publications = $scope.listBasedFilter.publications;
                    break;
                case "Work_Exp":
                    $scope.work_expOpen = false;
                    $scope.filterApplied.work_exp = $scope.listBasedFilter.work_exp;
                    break;
            }
        };

        $scope.$watch('listBasedFilter', function (newVal, oldVal) {
            if ($scope.listBasedFilter.grade_scale.length != 0) {

                $scope.gradeMax = Math.max.apply(Math, $scope.listBasedFilter.grade_scale);
            } else {
                $scope.gradeMax = 0;
            }
            if ($scope.listBasedFilter.eng_scale.length != 0) {
                $scope.engMax = Math.max.apply(Math, $scope.listBasedFilter.eng_scale);

            } else {
                $scope.engMax = 0;
            }
        }, true);

        /**
         * Set auto focus when dropdown is openned
         */
        $scope.focusInput = function () {
            $timeout(function () {
                $("#university .dropdown-menu input").val("");
                $("#major .dropdown-menu input").val("");
                $("#college .dropdown-menu input").val("");
                $("#department .dropdown-menu input").val("");

                $("#university .dropdown-menu input").focus();
                $("#major .dropdown-menu input").focus();
                $("#college .dropdown-menu input").focus();
                $("#department .dropdown-menu input").focus();
            }, 200);
        };

        /**
         * Reset all filter chips
         */
        $scope.resetFilter = function () {
            $scope.filterApplied = {};
            $scope.listBasedFilter.status = ['Admit', 'Reject'];
            $scope.listBasedFilter.term = ['Spring', 'Fall'];
            $scope.listBasedFilter.eng_scale = [9, 120];
            $scope.listBasedFilter.year = [2006, 2019];
            $scope.listBasedFilter.gre_q = [130, 170];
            $scope.listBasedFilter.gre_v = [130, 170];
            $scope.listBasedFilter.gre_awa = [0, 6];
            $scope.listBasedFilter.gre_total = [260, 340];
            $scope.listBasedFilter.grade_scale = [4, 10, 100];
            $scope.listBasedFilter.publications = [0, $scope.maxPublication];
            $scope.listBasedFilter.work_exp = [0, $scope.maxWorkExp];
        };

        $scope.showLimitReachedModal = function () {
            ModalService.showModal({
                templateUrl: "limit-reached",
                controller: function ($scope, close) {
                }
            }).then(function (modal) {
                modal.element.modal();
            });
        };


        
        $scope.validateSmartFilter = function (data) {
            var gre_v = parseInt(data.gre_v);
            var gre_q = parseInt(data.gre_q);
            var eng_score = parseInt(data.eng_score);
            
            if( Number.isNaN(gre_v) == false && (gre_v < 140 || gre_v > 160))
            {
                data.errors.gre_v="Must be between 140-160";
                return false;
            }     
            if( Number.isNaN(gre_q) == false &&   (gre_q < 140 || gre_q > 160)) {
                data.errors.gre_q="Must be between 140-160";
                return false;
            }
            if( Number.isNaN(eng_score) == false &&   (eng_score < 0 || eng_score > 110)) {
                data.errors.eng_score="Must be between 0-110";
                return false;
            }
            return true;
        }
        /**
         * Smart Filter Dialog
         */

        $scope.chooseTerm = function(value) {
            if($scope.smartBaseFilter.term == undefined) {
                $scope.smartBaseFilter.term = new Array();
            }
            var index = $scope.smartBaseFilter.term.indexOf(value);
            if(index==-1) {
                $scope.smartBaseFilter.term.push(value);
            }
            else {
                $scope.smartBaseFilter.term.splice(index, 1);
            }
            
        }

        $scope.smartBase_change_grade = function() {
            if($scope.smartBaseFilter.grade != "") {
                var grade = parseInt($scope.smartBaseFilter.grade);
                var grade_scale = grade <= 4?4:grade > 10? 100:10;
    
                $scope.smartBaseFilter.grade_scale = grade_scale;
            }
            else {
                delete $scope.smartBaseFilter.grade;
                delete $scope.smartBaseFilter.grade_scale;
            }
            
        }
        $scope.smartFilter = function() {
            //$scope.smartBaseFilter = {...$scope.filterApplied};
            ModalService.showModal({
                templateUrl:"smart-filter-modal",
                scope:$scope,
                controller: function($scope, $element, close) {
                    $scope.smartFilterBtnClicked = function() {
                        $scope.smartBaseFilter.errors= {};
                        if($scope.validateSmartFilter($scope.smartBaseFilter)) {
                            if('target_major' in $scope.smartBaseFilter) {
                                    $scope.filterApplied.target_major = $scope.smartBaseFilter.target_major;
                                    $scope.listBasedFilter.target_major = $scope.smartBaseFilter.target_major;
                            }
                            else {
                                delete $scope.filterApplied.target_major;
                                delete $scope.listBasedFilter.target_major;
                            }
                            if('term' in $scope.smartBaseFilter) {
                                if($scope.smartBaseFilter.term!="") {
                                    $scope.listBasedFilter.term = [...$scope.smartBaseFilter.term];
                                    $scope.filterApplied.term = [...$scope.smartBaseFilter.term];
                                }
                            }
                            if('department' in $scope.smartBaseFilter) {
                                $scope.listBasedFilter.department = $scope.smartBaseFilter.department;
                                $scope.filterApplied.department = $scope.listBasedFilter.department;
                            }
                            else {
                                delete $scope.filterApplied.department;
                                delete $scope.listBasedFilter.department;
                            }
                            if('grade' in $scope.smartBaseFilter &&  $scope.smartBaseFilter.grade!="")
                            {
                                var grade = parseInt($scope.smartBaseFilter.grade);
                                var grade_scale = grade <= 4?4:grade > 10? 100:10;

                                var grade_vary = grade <= 4? 0.3: grade > 10?10:0.5;

                                $scope.listBasedFilter.grade = [grade - grade_vary, grade +grade_vary];
                                $scope.filterApplied.grade = $scope.listBasedFilter.grade;

                                $scope.listBasedFilter.grade_scale = [grade_scale];
                                $scope.filterApplied.grade_scale = $scope.listBasedFilter.grade_scale;

                            }
                            
                            if('gre_v' in $scope.smartBaseFilter && $scope.smartBaseFilter.gre_v!="") {
                                var gre_v = parseInt($scope.smartBaseFilter.gre_v );
                                $scope.listBasedFilter.gre_v = [gre_v - 10, gre_v + 10];
                                $scope.filterApplied.gre_v = [gre_v - 10, gre_v + 10];

                            }
                            if('gre_q' in $scope.smartBaseFilter && $scope.smartBaseFilter.gre_q!="") {
                                var gre_q = parseInt($scope.smartBaseFilter.gre_q);
                                $scope.listBasedFilter.gre_q = [gre_q - 10, gre_q + 10];
                                $scope.filterApplied.gre_q = [gre_q - 10, gre_q + 10];

                            
                            }
                            if('eng_score' in $scope.smartBaseFilter && $scope.smartBaseFilter.eng_score!="") {
                                    var eng_score = parseInt($scope.smartBaseFilter.eng_score );
                                    if(eng_score <= 9) {
                                        $scope.listBasedFilter.eng = [eng_score, eng_score];
                                        $scope.filterApplied.eng = [eng_score, eng_score];
                                        $scope.listBasedFilter.eng_scale=[9];
                                        $scope.filterApplied.eng_scale=[9];
                                    } else {
                                        $scope.listBasedFilter.eng = [eng_score - 10, eng_score + 10];
                                        $scope.filterApplied.eng = [eng_score - 10, eng_score + 10];
                                        $scope.listBasedFilter.eng_scale=[120];
                                        $scope.filterApplied.eng_scale=[120];
                                    }
                            }
                            $scope.queryFilteredResult();
                            $element.modal('hide');
                            close(null, 500);
                        }
                        
                    }
                },
                controllerAs:"TablePageCtrl",
            }).then(function (modal) {
                modal.element.modal();
                
            });
        };


       
        





        function stopTracking() {
            if ($scope.current_tracking_id) {
                $http({
                    method: 'GET',
                    url: '/dashboard/endtracking/' + $scope.current_tracking_id
                });
            }
        }

        /**
         * Update tracking when user close or reload tab
         * @param e
         */
        $window.onbeforeunload = function (e) {
            stopTracking();
        };
    })
    .filter('na', function () {
        return function (input) {
            if (input == '-1') {
                return 'N/A';
            }
            return input;
        }
    });

