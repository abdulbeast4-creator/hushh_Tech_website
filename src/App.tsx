import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HomePage from './pages/home/ui';
import Leadership from './components/Leadership';
import Philosophy from './components/Philosophy';
import Footer from './components/Footer';
import LoginPage from './pages/login/ui'
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import OnboardingShellAutoPadding from './components/OnboardingShellAutoPadding';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import Consumers from './pages/services/consumers';
import Business from './pages/services/business';
import SignupPage from './pages/signup/ui';
import Faq from './pages/faq';
import Career from './pages/career';
import CommunityPage from './pages/community/ui';
import CommunityPostPage from './pages/community/post-ui';
import ReportDetailPage from './pages/reports/reportDetail';
import BenefitsPage from './pages/benefits';
import PrivacyPolicy from './pages/privacy-policy';
import CareersPrivacyPolicy from './pages/career-privacy-policy';
import CaliforniaPrivacyPolicy from './pages/california-privacy-policy';
import EUUKPrivacyPolicy from './pages/eu-uk-privacy-policy';
import DeleteAccountPage from './pages/delete-account';
import { useEffect, ReactNode } from 'react';
import Profile from './pages/profile';
import AuthCallback from './pages/AuthCallback';
import KYCVerificationPage from './pages/kyc-verification/page';
import NDARequestModalComponent from './components/NDARequestModal';
import UserProfilePage from './pages/user-profile/page';
import InvestorProfilePage from './pages/investor-profile';
import KYCFormPage from './pages/kyc-form/page';
import DiscoverFundA from './pages/discover-fund-a';
import SellTheWallPage from './pages/sell-the-wall';
import AIPoweredBerkshirePage from './pages/ai-powered-berkshire';
import UserRegistration from './pages/UserRegistration';
import ProtectedRoute from './components/ProtectedRoute';
import YourProfilePage from './pages/your-profile';
import HushhUserProfilePage from './pages/hushh-user-profile';
import ViewPreferencesPage from './pages/hushh-user-profile/view';
import PrivacyControlsPage from './pages/hushh-user-profile/privacy';
import PublicHushhProfilePage from './pages/hushhid';
import PublicInvestorProfilePage from './pages/investor/PublicInvestorProfile';
import HushhIDHeroDemo from './pages/hushhid-hero-demo';
import FinancialLinkPage from './pages/onboarding/financial-link/ui';
import OnboardingStep1 from './pages/onboarding/step-1/ui';
import OnboardingStep2 from './pages/onboarding/step-2/ui';
import OnboardingStep3 from './pages/onboarding/step-3/ui';
import OnboardingStep4 from './pages/onboarding/step-4/ui';
import OnboardingStep5 from './pages/onboarding/step-5/ui';
import OnboardingStep6 from './pages/onboarding/step-6/ui';
import OnboardingStep7 from './pages/onboarding/step-7/ui';
import OnboardingReviewStep from './pages/onboarding/step-8/ui';
import OnboardingBankDetailsStep from './pages/onboarding/step-9/ui';
import VerifyIdentityPage from './pages/onboarding/verify-identity/ui';
import VerifyCompletePage from './pages/onboarding/verify-complete/ui';
import MeetCeoPage from './pages/onboarding/meet-ceo/ui';
import InvestorGuidePage from './pages/onboarding/InvestorGuide';
import KYCDemoPage from './pages/kyc-demo';
import KycFlowPage from './pages/kyc-flow';
import A2APlaygroundPage from './pages/a2a-playground';
import ReceiptGeneratorPage from './pages/receipt-generator';
import DeveloperDocsPage from './pages/developer-docs';
import MobileBottomNav from './components/MobileBottomNav';
import HushhAIPage from './hushh-ai/pages';
import { LoginPage as HushhAILoginPage, SignupPage as HushhAISignupPage } from './hushh-ai/presentation/pages';
import KaiApp from './kai/pages';
import HushhStudioApp from './hushh-studio/pages';
import GlobalNDAGate from './components/GlobalNDAGate';
import SignNDAPage from './pages/sign-nda';
import DocumentViewerPage from './pages/document-viewer';
import NDAAdminPage from './pages/nda-admin';
import { AuthSessionProvider, useAuthSession } from './auth/AuthSessionProvider';
import AuthRequiredRoute from './components/AuthRequiredRoute';
import PageTransition from './components/PageTransition';

// Google Analytics configuration
const GA_TRACKING_ID = 'G-R58S9WWPM0';
const KaiIndiaApp = React.lazy(() => import('./kai-india/pages'));

// Content wrapper component that applies conditional margin
const ContentWrapper = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/signUp' || location.pathname === '/solutions';
  const isAuthCallback = location.pathname.startsWith('/auth/callback');
  const isUserRegistration = location.pathname === '/user-registration';
  const isOnboarding = location.pathname.startsWith('/onboarding');
  const isKycFlow = location.pathname.startsWith('/kyc-flow');
  const isKycDemo = location.pathname.startsWith('/kyc-demo');
  const isA2APlayground = location.pathname.startsWith('/a2a-playground');
  const isInvestorGuide = location.pathname === '/investor-guide';
  const isHushhAI = location.pathname.startsWith('/hushh-ai');
  const isKai = location.pathname.startsWith('/kai');
  const isStudio = location.pathname.startsWith('/studio');
  const isHushhUserProfile = location.pathname.startsWith('/hushh-user-profile');
  const isSignNda = location.pathname.startsWith('/sign-nda');
  const isDocumentViewer = location.pathname.startsWith('/document-viewer');
  const isInvestorProfile = location.pathname.startsWith('/investor-profile');
  const isPublicInvestorProfile = location.pathname.startsWith('/investor/');
  const isDiscoverFundA = location.pathname === '/discover-fund-a';
  const isCommunity = location.pathname.startsWith('/community');
  const isDeleteAccount = location.pathname === '/delete-account';
  const isLogin = location.pathname.toLowerCase() === '/login';
  const isSignup = location.pathname.toLowerCase() === '/signup';
  const isProfile = location.pathname === '/profile';

  return (
    <div className={`${isHomePage || isAuthCallback || isUserRegistration || isOnboarding || isKycFlow || isKycDemo || isA2APlayground || isInvestorGuide || isHushhAI || isKai || isStudio || isHushhUserProfile || isSignNda || isDocumentViewer || isInvestorProfile || isPublicInvestorProfile || isDiscoverFundA || isCommunity || isDeleteAccount || isLogin || isSignup || isProfile ? '' : 'mt-20'}`}>
      {children}
    </div>
  );
};

// Layout visibility hook - determines which components to show based on route
const useLayoutVisibility = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isHushhAI = location.pathname.startsWith('/hushh-ai');
  const isKai = location.pathname.startsWith('/kai');
  const isStudio = location.pathname.startsWith('/studio');
  const isOnboarding = location.pathname.startsWith('/onboarding');
  const isProfile = location.pathname === '/profile';
  const isFundA = location.pathname === '/discover-fund-a';
  const isCommunity = location.pathname.startsWith('/community');
  const isDeleteAccount = location.pathname === '/delete-account';
  const isLogin = location.pathname.toLowerCase() === '/login';
  const isSignup = location.pathname.toLowerCase() === '/signup';
  const isSignNda = location.pathname.startsWith('/sign-nda');
  const isDocumentViewer = location.pathname.startsWith('/document-viewer');
  const isHushhUserProfile = location.pathname.startsWith('/hushh-user-profile');

  // All pages using HushhTechHeader — hide old global Navbar/Footer
  const isKycFlow = location.pathname.startsWith('/kyc-flow');
  const isKycDemo = location.pathname.startsWith('/kyc-demo');
  const isA2APlayground = location.pathname.startsWith('/a2a-playground');
  const isPublicInvestorProfile = location.pathname.startsWith('/investor/');
  const hideOld = isHushhAI || isKai || isStudio || isHomePage || isOnboarding || isProfile || isFundA || isCommunity || isDeleteAccount || isLogin || isSignup || isSignNda || isDocumentViewer || isHushhUserProfile || isKycFlow || isKycDemo || isA2APlayground || isPublicInvestorProfile;
  return {
    showNavbar: !hideOld,
    showFooter: !hideOld,
    showMobileNav: !hideOld,
  };
};

// Google Analytics setup function
const initializeGoogleAnalytics = () => {
  // Check if gtag is already loaded
  if (typeof window !== 'undefined' && !window.gtag) {
    // Create script element for gtag
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_TRACKING_ID);
    };
  }
};

// AnimatedRoutes component - wraps Routes with AnimatePresence for page transitions
const AnimatedRoutes = ({ session }: { session: any }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.key}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/about/leadership" element={<PageTransition><Leadership /></PageTransition>} />
        <Route path="/about/philosophy" element={<PageTransition><Philosophy /></PageTransition>} />
        <Route path="/Login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/Contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/benefits" element={<PageTransition><BenefitsPage /></PageTransition>} />
        <Route path='/services/consumers' element={<PageTransition><Consumers /></PageTransition>} />
        <Route path='/services/business' element={<PageTransition><Business /></PageTransition>} />
        <Route path='/Signup' element={<PageTransition><SignupPage /></PageTransition>} />
        <Route path='/faq' element={<PageTransition><Faq /></PageTransition>} />
        <Route path='/profile' element={
          <AuthRequiredRoute>
            <PageTransition><Profile /></PageTransition>
          </AuthRequiredRoute>
        } />
        <Route path="/career" element={<PageTransition><Career /></PageTransition>} />
        <Route path="/career/*" element={<PageTransition><Career /></PageTransition>} />
        <Route path='/privacy-policy' element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path='/carrer-privacy-policy' element={<PageTransition><CareersPrivacyPolicy /></PageTransition>} />
        <Route path="/community" element={
          <PageTransition><CommunityPage /></PageTransition>
        } />
        <Route path='/california-privacy-policy' element={<PageTransition><CaliforniaPrivacyPolicy /></PageTransition>} />
        <Route path='/eu-uk-jobs-privacy-policy' element={<PageTransition><EUUKPrivacyPolicy /></PageTransition>} />
        <Route path='/delete-account' element={
          <AuthRequiredRoute>
            <PageTransition><DeleteAccountPage /></PageTransition>
          </AuthRequiredRoute>
        } />
        <Route path="/community/*" element={
          <PageTransition><CommunityPostPage /></PageTransition>
        } />
        <Route path="/reports/:id" element={
          <PageTransition><ReportDetailPage /></PageTransition>
        } />
        <Route path="/auth/callback" element={<PageTransition><AuthCallback /></PageTransition>} />
        <Route path="/investor-guide" element={<PageTransition><InvestorGuidePage /></PageTransition>} />
        <Route path="/onboarding/financial-link" element={
          <ProtectedRoute>
            <PageTransition><FinancialLinkPage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/onboarding/step-1" element={
          <ProtectedRoute>
            <PageTransition><OnboardingStep1 /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/onboarding/step-2" element={
          <ProtectedRoute>
            <PageTransition><OnboardingStep2 /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/onboarding/step-3" element={
          <ProtectedRoute>
            <PageTransition><OnboardingStep3 /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/onboarding/step-4" element={
          <ProtectedRoute>
            <PageTransition><OnboardingStep4 /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/onboarding/step-5" element={
          <ProtectedRoute>
            <PageTransition><OnboardingStep5 /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/onboarding/step-6" element={
          <ProtectedRoute>
            <PageTransition><OnboardingStep6 /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/onboarding/step-7" element={
          <ProtectedRoute>
            <PageTransition><OnboardingStep7 /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/onboarding/step-8" element={
          <ProtectedRoute>
            <PageTransition><OnboardingReviewStep /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/onboarding/step-9" element={
          <ProtectedRoute>
            <PageTransition><OnboardingBankDetailsStep /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/onboarding/verify" element={
          <ProtectedRoute>
            <PageTransition><VerifyIdentityPage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/onboarding/verify-complete" element={
          <ProtectedRoute>
            <PageTransition><VerifyCompletePage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/onboarding/meet-ceo" element={
          <ProtectedRoute>
            <PageTransition><MeetCeoPage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/hushh-user-profile" element={
          <ProtectedRoute>
            <PageTransition><HushhUserProfilePage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/hushh-user-profile/view" element={
          <ProtectedRoute>
            <PageTransition><ViewPreferencesPage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/hushh-user-profile/privacy" element={
          <ProtectedRoute>
            <PageTransition><PrivacyControlsPage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/profile/:id" element={
          <AuthRequiredRoute>
            <PageTransition><ViewPreferencesPage /></PageTransition>
          </AuthRequiredRoute>
        } />
        <Route path="/hushhid/:id" element={<PageTransition><PublicHushhProfilePage /></PageTransition>} />
        <Route path="/hushhid-hero-demo" element={<PageTransition><HushhIDHeroDemo /></PageTransition>} />
        <Route path='/kyc-verification' element={
          <PageTransition><KYCVerificationPage /></PageTransition>
        } />
        <Route path='/kyc-form' element={
          <PageTransition><KYCFormPage /></PageTransition>
        } />
        <Route path='/discover-fund-a' element={
          <PageTransition><DiscoverFundA /></PageTransition>
        } />
        <Route path='/sell-the-wall' element={
          <PageTransition><SellTheWallPage /></PageTransition>
        } />
        <Route path='/ai-powered-berkshire' element={
          <PageTransition><AIPoweredBerkshirePage /></PageTransition>
        } />
        <Route path='/user-registration' element={
          <ProtectedRoute>
            <PageTransition><UserRegistration /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path='/nda-form' element={
          <AuthRequiredRoute>
            <PageTransition>
              <NDARequestModalComponent
                session={session}
                onSubmit={(result: string) => {
                  console.log("NDA submission result:", result);
                  if (result === "Approved" || result === "Pending" || result === "Requested permission") {
                    window.location.href = "/";
                  }
                }}
              />
            </PageTransition>
          </AuthRequiredRoute>
        } />
        <Route path='/investor-profile' element={
          <ProtectedRoute>
            <PageTransition><InvestorProfilePage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path='/investor/:slug' element={<PageTransition><PublicInvestorProfilePage /></PageTransition>} />
        <Route path='/user-profile' element={
          <AuthRequiredRoute>
            <PageTransition><UserProfilePage /></PageTransition>
          </AuthRequiredRoute>
        } />
        <Route path='/your-profile' element={
          <AuthRequiredRoute>
            <PageTransition><YourProfilePage /></PageTransition>
          </AuthRequiredRoute>
        } />
        <Route path='/kyc-demo' element={<PageTransition><KYCDemoPage /></PageTransition>} />
        <Route path='/kyc-flow' element={<PageTransition><KycFlowPage /></PageTransition>} />
        <Route path='/a2a-playground' element={<PageTransition><A2APlaygroundPage /></PageTransition>} />
        <Route path='/receipt-generator' element={<PageTransition><ReceiptGeneratorPage /></PageTransition>} />
        <Route path='/developer-docs' element={<PageTransition><DeveloperDocsPage /></PageTransition>} />
        <Route path='/hushh-ai' element={<PageTransition><HushhAIPage /></PageTransition>} />
        <Route path='/hushh-ai/login' element={<PageTransition><HushhAILoginPage /></PageTransition>} />
        <Route path='/hushh-ai/signup' element={<PageTransition><HushhAISignupPage /></PageTransition>} />
        <Route path='/kai' element={<PageTransition><KaiApp /></PageTransition>} />
        <Route
          path='/kai-india'
          element={
            <Suspense fallback={<div className="min-h-screen bg-black" />}>
              <PageTransition><KaiIndiaApp /></PageTransition>
            </Suspense>
          }
        />
        <Route path='/studio' element={<PageTransition><HushhStudioApp /></PageTransition>} />
        <Route path='/sign-nda' element={<PageTransition><SignNDAPage /></PageTransition>} />
        <Route path='/document-viewer' element={<PageTransition><DocumentViewerPage /></PageTransition>} />
        <Route path='/nda-admin' element={<PageTransition><NDAAdminPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  // Initialize Google Analytics
  useEffect(() => {
    initializeGoogleAnalytics();
  }, []);

  // Inner layout component that uses hooks for conditional rendering
  const AppLayout = () => {
    const { showNavbar, showFooter, showMobileNav } = useLayoutVisibility();
    const { session } = useAuthSession();
    
    return (
      <div className="min-h-screen flex flex-col">
        {showNavbar && <Navbar />}
        <ContentWrapper>
          <AnimatedRoutes session={session} />
        </ContentWrapper>
        {showFooter && <Footer />}
        {showMobileNav && <MobileBottomNav />}
      </div>
    );
  };

  return (
    <ChakraProvider theme={theme}>
      <AuthSessionProvider>
        <Router>
          <ScrollToTop />
          <OnboardingShellAutoPadding />
          <GlobalNDAGate>
            <AppLayout />
          </GlobalNDAGate>
        </Router>
      </AuthSessionProvider>
    </ChakraProvider>
  );
}

export default App;
