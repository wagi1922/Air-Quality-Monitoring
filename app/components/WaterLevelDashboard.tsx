import { 
  Droplets,
  Wind, 
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Cloudy,
  Thermometer,
  ThermometerSun,
  ThermometerSnowflake
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import CircularGauge from './ui/circular-gauge';
import LineChart from './ui/line-chart';

export default function WaterLevelDashboard() {
  // Mock data for demonstration
  const suhu = 35;
  const kelembapanUdara = 75;
  const co2 = 100;
  const Asap = 400;
  const lastUpdate = "LANCAR";

  // Historical data for the line chart (last 24 hours)
  const rawData = [
    { "mq135_ppm": 450.5, "waktu": "Fri, 29 Nov 2024 00:10:05 GMT" },
    { "mq135_ppm": 460.2, "waktu": "Fri, 29 Nov 2024 02:10:05 GMT" },
    { "mq135_ppm": 410.2, "waktu": "Fri, 29 Nov 2024 02:10:05 GMT" },
    { "mq135_ppm": 420.8, "waktu": "Fri, 29 Nov 2024 04:10:05 GMT" },
    { "mq135_ppm": 480.1, "waktu": "Fri, 29 Nov 2024 06:10:05 GMT" },
    { "mq135_ppm": 490.3, "waktu": "Fri, 29 Nov 2024 08:10:05 GMT" },
    { "mq135_ppm": 500.0, "waktu": "Fri, 29 Nov 2024 10:10:05 GMT" },
    { "mq135_ppm": 510.4, "waktu": "Fri, 29 Nov 2024 12:10:05 GMT" },
    { "mq135_ppm": 520.6, "waktu": "Fri, 29 Nov 2024 14:10:05 GMT" },
    { "mq135_ppm": 530.2, "waktu": "Fri, 29 Nov 2024 16:10:05 GMT" },
  ];

  const chartData = rawData.map(item => {
  const date = new Date(item.waktu);
  // Ambil Jam dan Menit saja (misal: 00:10)
  const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  
  return {
    time: timeString,
    level: item.mq135_ppm // Mengambil MQ135 sebagai data utama
  };
});


  const getIcon = (val: number) => {
    if (val >= 35) {
      return <ThermometerSun className="w-6 h-6 mr-3 text-blue-600" />;
    } else if (val <= 25) {
      return <ThermometerSnowflake className="w-6 h-6 mr-3 text-blue-600" />;
    } else {
      return <Thermometer className="w-6 h-6 mr-3 text-blue-600" />;
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #E6F0FF 0%, #F0F8FF 40%, #FFFFFF 100%)',
      }}
    >
      {/* Enhanced Abstract Wave Patterns */}
      <div className="absolute inset-0 opacity-6">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#93C5FD" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DBEAFE" />
              <stop offset="100%" stopColor="#BFDBFE" />
            </linearGradient>
          </defs>
          <path d="M0,100 C300,200 600,0 900,100 C1000,150 1100,50 1200,100 L1200,0 L0,0 Z" fill="url(#waveGradient1)" className="animate-pulse" opacity="0.08"/>
          <path d="M0,300 C300,400 600,200 900,300 C1000,350 1100,250 1200,300 L1200,0 L0,0 Z" fill="url(#waveGradient2)" className="animate-pulse" opacity="0.04"/>
          <path d="M0,500 C400,600 800,400 1200,500 L1200,0 L0,0 Z" fill="url(#waveGradient3)" className="animate-pulse" opacity="0.03"/>
        </svg>
      </div>

      {/* Enhanced Header Bar */}
      <header 
        className="backdrop-blur-md border-b border-white/20 px-4 sm:px-6 py-5 relative z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left side - Logo and title */}
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
              }}
            >
              <Wind className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Monitoring Kualitas Udara Persimpangan</h1>
              <p className="text-sm text-gray-600 hidden sm:block">IoT-Based Monitoring System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Kelembapan Udara Card */}
          <Card className="glassmorphism shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-white/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Kelembapan Udara</CardTitle>
              <div 
                className="p-3 rounded-xl shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.3)',
                }}
              >
                <Droplets className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-3">{kelembapanUdara}%</div>
              <Progress value={kelembapanUdara} className="h-3 mb-3" />
            </CardContent>
          </Card>

          {/* CO2/Benzena */}
          <Card className="glassmorphism shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-white/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">CO2/Benzena</CardTitle>
              <div 
                className="p-3 rounded-xl shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #34D399)',
                  boxShadow: '0 6px 16px rgba(16, 185, 129, 0.3)',
                }}
              >
                <div className="h-5 w-5 flex items-center justify-center font-bold text-[12px] leading-none text-white">
                  CO₂
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-1">{co2} ppm</div>
            </CardContent>
          </Card>

          {/* Asap/Hidrokarbon Card */}
          <Card className="glassmorphism shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-white/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Asap/Hidrokarbon</CardTitle>
              <div 
                className="p-3 rounded-xl shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                  boxShadow: '0 6px 16px rgba(245, 158, 11, 0.3)',
                }}
              >
                <Cloudy className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-1">{Asap} ppm</div> 
            </CardContent>
          </Card>

          {/* Status hasil prediksi  Card */}
          <Card className="glassmorphism shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-white/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Status Hasil Prediksi</CardTitle>
              <div 
                className="p-3 rounded-xl shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
                  boxShadow: '0 6px 16px rgba(139, 92, 246, 0.3)',
                }}
              >
                <Clock className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-1">{lastUpdate}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Large Circular Gauge Chart in Center */}
          <Card className="xl:col-span-1 glassmorphism shadow-xl hover:shadow-2xl transition-all duration-300 border-white/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                {getIcon(suhu)}
                Suhu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CircularGauge value={suhu} />
            </CardContent>
          </Card>

          {/* Line Chart with Smooth Curves */}
          <Card className="xl:col-span-2 glassmorphism shadow-xl hover:shadow-2xl transition-all duration-300 border-white/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
                Riwayat Kualitas Udara 24 Jam Terakhir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={chartData} unit="ppm"/>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer with Exact Specified Text */}
      <footer className="bg-white/40 backdrop-blur-md border-t border-white/30 px-4 sm:px-6 py-6 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-semibold text-gray-700">
            © 2025 Monitoring Kualitas Udara Persimpangan — <span className="font-bold text-blue-600">IoT-Based Monitoring System</span> | Matric No: <span className="font-bold text-blue-600">22351</span>
          </p>
        </div>
      </footer>
    </div>
  );
}