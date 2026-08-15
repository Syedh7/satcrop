import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';

import { SplashPage } from './pages/SplashPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapSelectPage } from './pages/MapSelectPage';
import { AnalyzingPage } from './pages/AnalyzingPage';
import { AnalysisResultPage } from './pages/AnalysisResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { MyFieldsPage } from './pages/MyFieldsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { Analysis, Field } from './types';

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  
  // Transient state across analysis flow
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [currentAnalysisResult, setCurrentAnalysisResult] = useState<any>(null);

  // If user is already logged in and currently on splash/login/register, default to dashboard
  React.useEffect(() => {
    if (!loading && user && (currentScreen === 'splash' || currentScreen === 'login' || currentScreen === 'register')) {
      setCurrentScreen('dashboard');
    }
  }, [user, loading]);

  const handleNavigate = (screen: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentScreen(screen);
  };

  const handleStartAnalysis = (locationData: any) => {
    setSelectedLocation(locationData);
    setCurrentScreen('analyzing');
  };

  const handleAnalysisComplete = (resultData: any) => {
    setCurrentAnalysisResult(resultData);
    setCurrentScreen('result');
  };

  const handleSelectHistoryAnalysis = (analysis: Analysis) => {
    setCurrentAnalysisResult(analysis);
    setCurrentScreen('result');
  };

  const handleAnalyzeSavedField = (field: Field) => {
    setSelectedLocation({
      lat: field.latitude,
      lng: field.longitude,
      district: field.district,
      state: field.state,
      area: field.area,
      fieldId: field.id,
      polygon: field.polygon_geojson ? JSON.parse(field.polygon_geojson) : undefined
    });
    setCurrentScreen('analyzing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-emerald-400 font-extrabold text-sm tracking-wider font-mono">
          INITIALIZING SATCROP AI...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Navigation Bar */}
      <Navbar currentScreen={currentScreen} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentScreen === 'splash' && (
          <SplashPage
            onGetStarted={() => handleNavigate(user ? 'dashboard' : 'login')}
            onLogin={() => handleNavigate('login')}
          />
        )}

        {currentScreen === 'login' && (
          <LoginPage
            onNavigateToRegister={() => handleNavigate('register')}
            onSuccess={() => handleNavigate('dashboard')}
          />
        )}

        {currentScreen === 'register' && (
          <RegisterPage
            onNavigateToLogin={() => handleNavigate('login')}
            onSuccess={() => handleNavigate('dashboard')}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardPage
            onNavigate={handleNavigate}
            onSelectAnalysis={handleSelectHistoryAnalysis}
          />
        )}

        {currentScreen === 'map' && (
          <MapSelectPage
            onStartAnalysis={handleStartAnalysis}
            onCancel={() => handleNavigate('dashboard')}
          />
        )}

        {currentScreen === 'analyzing' && selectedLocation && (
          <AnalyzingPage
            locationData={selectedLocation}
            onComplete={handleAnalysisComplete}
            onError={(msg) => {
              alert(msg);
              handleNavigate('map');
            }}
          />
        )}

        {currentScreen === 'result' && currentAnalysisResult && (
          <AnalysisResultPage
            analysisData={currentAnalysisResult}
            onSaveSuccess={() => handleNavigate('history')}
            onNewAnalysis={() => handleNavigate('map')}
            onOpenReportSession={() => {}}
          />
        )}

        {currentScreen === 'history' && (
          <HistoryPage
            onSelectAnalysis={handleSelectHistoryAnalysis}
            onNavigateToMap={() => handleNavigate('map')}
          />
        )}

        {currentScreen === 'fields' && (
          <MyFieldsPage
            onAnalyzeField={handleAnalyzeSavedField}
            onNavigateToMap={() => handleNavigate('map')}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfilePage onNavigate={handleNavigate} />
        )}

        {currentScreen === 'settings' && (
          <SettingsPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      {user && currentScreen !== 'splash' && currentScreen !== 'login' && currentScreen !== 'register' && (
        <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
