"use client";

import { useState, useEffect } from 'react';
import axios from 'axios'; 
import { 
  Droplets,
  Wind, 
  Clock,
  TrendingUp,
  Cloudy,
  Thermometer,
  ThermometerSun,
  ThermometerSnowflake,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import CircularGauge from './ui/circular-gauge';
import LineChart from './ui/line-chart';

export default function WaterLevelDashboard() {
  const API_URL = "http://jalaniotkel4.my.id/ambil-data";
  //const API_URL = "http://jalaniotkel4.my.id/ambil-data?limit=1.800"; 

  const [sensorData, setSensorData] = useState({
    suhu: 0,
    kelembaban: 0,
    mq135_ppm: 0,
    mq2_ppm: 0,
    status_jalan: "Memuat..."
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const safeNumber = (val: any) => {
    const num = Number(val);
    return isFinite(num) ? num : 0;
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      const result = response.data;
      console.log("Data diterima:", result);

      if (result && result.status === "Sukses" && Array.isArray(result.data) && result.data.length > 0) {
        const latest = result.data[0];

        setSensorData({
          suhu: Math.round(safeNumber(latest.suhu)), 
          kelembaban: Math.round(safeNumber(latest.kelembaban)), 
          mq135_ppm: parseFloat(safeNumber(latest.mq135_ppm).toFixed(2)),
          mq2_ppm: parseFloat(safeNumber(latest.mq2_ppm).toFixed(2)),
          status_jalan: latest.status_jalan || "Menunggu..."
        });

        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

        let recentData = result.data.filter((item: any) => {
          const itemTime = new Date(item.waktu);
          return !isNaN(itemTime.getTime()) && itemTime >= oneDayAgo && itemTime <= now;
        });

        if (recentData.length === 0) {
          recentData = result.data.slice(0, 24);
        }

        const hourlyGroups: { [key: string]: { sum: number; count: number; date: Date } } = {};

        recentData.forEach((item: any) => {
          const date = new Date(item.waktu);
          if (isNaN(date.getTime())) return;

          const key = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}`;
          
          if (!hourlyGroups[key]) {
            hourlyGroups[key] = { sum: 0, count: 0, date: date };
          }

          hourlyGroups[key].sum += safeNumber(item.mq135_ppm);
          hourlyGroups[key].count += 1;
        });

        const aggregatedData = Object.keys(hourlyGroups)
          .map(key => {
            const group = hourlyGroups[key];
            const avgLevel = group.sum / group.count;
            const timeString = `${group.date.getHours().toString().padStart(2, '0')}:00`;
            return {
              time: timeString,
              level: parseFloat(avgLevel.toFixed(2)),
              fullDate: group.date
            };
          })
          .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

        setChartData(aggregatedData);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); 
    return () => clearInterval(interval);
  }, []);

  const getIcon = (val: number) => {
    const aman = safeNumber(val);
    if (aman >= 35) {
      return <ThermometerSun className="w-6 h-6 mr-3 text-blue-600" />;
    } else if (aman <= 25) {
      return <ThermometerSnowflake className="w-6 h-6 mr-3 text-blue-600" />;
    } else {
      return <Thermometer className="w-6 h-6 mr-3 text-blue-600" />;
    }
  };

  const colorStatus = (status_jalan: string) => {
    if (status_jalan === "BAIK") {
      return <div className="text-4xl font-bold text-green-500 mb-1">{sensorData.status_jalan}</div>
    } else if (status_jalan === "SEDANG") {
      return <div className="text-4xl font-bold text-yellow-500 mb-1">{sensorData.status_jalan}</div>;
    } else if (status_jalan === "TIDAK SEHAT") {
      return <div className="text-4xl font-bold text-red-500 mb-1">{sensorData.status_jalan}</div>;
    } else {
      return <div className="text-4xl font-bold text-gray-900 mb-1">{sensorData.status_jalan}</div>;
    }
  }

  const display = (val: any) => {
    return safeNumber(val);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #E6F0FF 0%, #F0F8FF 40%, #FFFFFF 100%)',
      }}
    >
      {/* Background SVG */}
      <div className="absolute inset-0 opacity-6">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
           <path d="M0,100 C300,200 600,0 900,100 L1200,0 L0,0 Z" fill="#3B82F6" opacity="0.08"/>
        </svg>
      </div>

      {/* Header */}
      <header className="backdrop-blur-md border-b border-white/20 px-4 sm:px-6 py-5 relative z-10 bg-white/90 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-blue-600">
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
          
          {/* Kelembapan Udara */}
          <Card className="glassmorphism shadow-xl border-white/30">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Kelembapan Udara</CardTitle>
              <div className="p-3 rounded-xl bg-blue-500 shadow-lg">
                <Droplets className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-3">{display(sensorData.kelembaban)}%</div>
              <Progress value={display(sensorData.kelembaban)} className="h-3 mb-3" />
            </CardContent>
          </Card>

          {/* CO2/Benzena */}
          <Card className="glassmorphism shadow-xl border-white/30">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">CO2/Benzena</CardTitle>
              <div className="p-3 rounded-xl bg-green-500 shadow-lg">
                <div className="h-5 w-5 flex items-center justify-center font-bold text-white text-xs">CO₂</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-1">{display(sensorData.mq135_ppm)} ppm</div>
            </CardContent>
          </Card>

          {/* Asap/Hidrokarbon */}
          <Card className="glassmorphism shadow-xl border-white/30">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Asap/Hidrokarbon</CardTitle>
              <div className="p-3 rounded-xl bg-yellow-500 shadow-lg">
                <Cloudy className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-1">{display(sensorData.mq2_ppm)} ppm</div> 
            </CardContent>
          </Card>

          {/* Status Jalan */}
          <Card className="glassmorphism shadow-xl border-white/30">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Status Udara</CardTitle>
              <div className="p-3 rounded-xl bg-purple-500 shadow-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              {colorStatus(sensorData.status_jalan)}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          <Card className="xl:col-span-1 glassmorphism shadow-xl border-white/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                {getIcon(sensorData.suhu)} Suhu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CircularGauge value={display(sensorData.suhu)} />
            </CardContent>
          </Card>

          <Card className="xl:col-span-2 glassmorphism shadow-xl border-white/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
                Riwayat Kualitas Udara
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[300px] flex items-center justify-center">
              {!loading && chartData.length > 0 ? (
                 <LineChart data={chartData} unit="ppm"/>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  {loading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin mb-2" />
                      <p>Sedang memuat data...</p>
                    </>
                  ) : (
                    <p>Menunggu data sensor...</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-white/40 backdrop-blur-md border-t border-white/30 px-4 sm:px-6 py-6 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-semibold text-gray-700">© 2025 IoT Monitoring</p>
        </div>
      </footer>
    </div>
  );
}