<!DOCTYPE html>
<html>
<head>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-71770676-2"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-71770676-2');
    </script>

<title>{{ isset($tag_name)? $tag_name." (".$tag_name.') Profile Evaluation with Latest Admits & Rejects':'Admits.fyi | Latest MS in US Admits & Rejects'}} </title>
@if(isset($tag_name))
<meta name="description" content="Evaluate your Profile for MS in US at {{$tag_name}} ({{$tag_name}}) with 400,000+ high quality admits and rejects containing GPA, GRE, TOEFL & IELTS scores
and UG College.">
@else
<meta content="admits.fyi, Study Abroad, MS in USA, MS in US, Masters Abroad, TOEFL, IELTS, GRE, Admits, Rejects, Profile Evaluation, University Shortlisting, SOP, Statement of Purpose, Application Help, ASU, NCSU, UTD" name="keywords">
<meta content="See 400,000+ admits & rejects with detailed profile information including GPA, GRE scores, TOEFL & IELTS scores, UG college." name="description">
@endif
<meta property="og:type" content= "website" />
<meta property="og:url" content="https://admits.fyi/"/>
<meta property="og:site_name" content="Admits.fyi - Masters, PhD in USA, Canada, Australia, Germany, UK" />

<meta name="_token" content="{{csrf_token()}}">
<meta name="facebook-domain-verification" content="99h6aohwfwgu8twt96hp5dkklvhjbi" />
<link rel='icon' href='/resources/assets/image/favicon.png' type='image/x-icon'>
<link rel="stylesheet" href="/resources/assets/bower_components/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="/resources/assets/bower_components/bootstrap/dist/css/bootstrap-theme.min.css">
<link rel="stylesheet" href="/resources/assets/bower_components/angular-bootstrap/ui-bootstrap-csp.css">

<link rel="stylesheet" href="/resources/assets/bower_components/ngToast/dist/ngToast.min.css">
<link rel="stylesheet" href="/resources/assets/bower_components/ngToast/dist/ngToast-animations.min.css">

<link rel="stylesheet" href="/resources/assets/bower_components/font-awesome/css/font-awesome.min.css">

<link rel="stylesheet"
      href="/resources/assets/bower_components/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css">
{{--AdminLTE--}}
<link rel="stylesheet" href="/resources/assets/admin/dist/css/AdminLTE.css">
<link rel="stylesheet" href="/resources/assets/admin/dist/css/skins/_all-skins.min.css">


<link rel="stylesheet"
      href="/resources/assets/bower_components/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css">
<link rel="stylesheet"
      href="/resources/assets/bower_components/angular-xeditable/dist/css/xeditable.min.css">
<link rel="stylesheet"
      href="/resources/assets/bower_components/angular-wizard/dist/angular-wizard.min.css">
<link rel="stylesheet"
      href="/resources/assets/bower_components/angular-spinkit/build/angular-spinkit.min.css">
{{--<link rel="stylesheet"--}}
{{--href="/resources/assets/bower_components/bootstrap_dropdowns_enhancement/css/dropdowns.css">--}}
<link href="/resources/assets/sass/global.css" rel="stylesheet" type="text/css">
@yield('css')

{{--Script--}}
<script src="/resources/assets/bower_components/jquery/dist/jquery.min.js"></script>
<script src="/resources/assets/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="/resources/assets/bower_components/underscore/underscore-min.js"></script>

{{--AdminLTE--}}
<script src="/resources/assets/admin/dist/js/app.min.js"></script>
<script src="/resources/assets/bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js"></script>

{{--Libraries--}}
<script src="/resources/assets/bower_components/angular/angular.min.js"></script>
<script src="/resources/assets/bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
<script src="/resources/assets/bower_components/angular-bootstrap/ui-bootstrap.js"></script>
<script src="/resources/assets/bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
<script src="/resources/assets/bower_components/angular-smart-table/dist/smart-table.min.js"></script>
<script src="/resources/assets/bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<script src="/resources/assets/bower_components/ngToast/dist/ngToast.min.js"></script>
<script src="/resources/assets/bower_components/angular-bootstrap-slider/slider.js"></script>
<script src="/resources/assets/bower_components/checklist-model/checklist-model.js"></script>
<script src="/resources/assets/bower_components/angular-xeditable/dist/js/xeditable.min.js"></script>
<script src="/resources/assets/bower_components/ng-file-upload/ng-file-upload-all.min.js"></script>
<script src="/resources/assets/bower_components/angular-spinkit/build/angular-spinkit.min.js"></script>
<script src="/resources/assets/bower_components/angular-progress-arc/angular-progress-arc.min.js"></script>
<script src="/resources/assets/bower_components/angular-svg-round-progressbar/build/roundProgress.min.js"></script>
<script src="/resources/assets/bower_components/angular-wizard/dist/angular-wizard.js"></script>
<script src="/resources/assets/bower_components/angular-vertilize/angular-vertilize.min.js"></script>
<script src="/resources/assets/bower_components/angular-validation/dist/angular-validation.js"></script>
<script src="/resources/assets/bower_components/angular-validation/dist/angular-validation-rule.min.js"></script>
<script src="/resources/assets/bower_components/angularUtils-pagination/dirPagination.js"></script>
<script src="/resources/assets/bower_components/angular-modal-service/dst/angular-modal-service.min.js"></script>
<script src="/resources/assets/bower_components/angular-elastic/elastic.js"></script>
{{-- Application js--}}
<script src="/resources/assets/scripts/app/app.js" type="text/javascript"></script>
{{--Page leavel specific js--}}
@yield('js')

<!-- Facebook Pixel Code -->
    <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1205779429525272');
        fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
                   src="https://www.facebook.com/tr?id=1205779429525272&ev=PageView&noscript=1"
        /></noscript>
    <!-- End Facebook Pixel Code -->


</head>
<body class="sidebar-collapse layout-top-nav" ng-app="mainApp" ng-controller="MainCtrl">
<div id="fb-root"></div>
<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v4.0&appId=1049150308494776&autoLogAppEvents=1"></script>
<div class="wrapper">
    @include('layouts.partial.header')
    <div class="content-wrapper">
        @yield('content')
    </div>
</div>
@include('layouts.partial.footer')
<toast></toast>
</body>

</html>