// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { farmAPI, weatherAPI } from '../services/api';
import { Sprout, CloudRain, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [farmsResponse, weatherResponse] = await Promise.all([
        farmAPI.getFarms(),
        user?.location?.district ? weatherAPI.getWeather(user.location.district) : Promise.resolve(null)
      ]);

      setFarms(farmsResponse.data);
      if (weatherResponse) {
        setWeather(weatherResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: Sprout,
      label: 'Total Farms',
      value: farms.length,
      color: 'green'
    },
    {
      icon: CloudRain,
      label: 'Weather',
      value: weather ? `${weather.temperature?.current}°C` : 'N/A',
      color: 'blue'
    },
    {
      icon: TrendingUp,
      label: 'Active Crops',
      value: farms.reduce((acc, farm) => acc + (farm.cropType ? 1 : 0), 0),
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto"></div>
          <p className="mt-4 text-natural-brown">Loading your farm data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary-green mb-4">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-xl text-natural-brown">
          Here's your farming overview for today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            green: 'border-l-primary-green bg-gradient-to-r from-white to-green-50',
            blue: 'border-l-natural-sky bg-gradient-to-r from-white to-blue-50',
            orange: 'border-l-accent-gold bg-gradient-to-r from-white to-amber-50'
          };
          
          return (
            <div 
              key={index} 
              className={`p-6 rounded-xl shadow-lg border-l-4 ${colorClasses[stat.color]} transition-transform duration-200 hover:scale-105`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  stat.color === 'green' ? 'bg-primary-green' : 
                  stat.color === 'blue' ? 'bg-natural-sky' : 'bg-accent-gold'
                } text-white`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary-green">{stat.value}</h3>
                  <p className="text-natural-brown">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weather Alert */}
      {weather && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-natural-sky rounded-xl p-6 mb-8 flex items-center space-x-4">
          <AlertCircle size={24} className="text-natural-sky flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-primary-green">Weather in {user?.location?.district}</h4>
            <p className="text-natural-brown">
              {weather.condition} • {weather.temperature?.current}°C • 
              Humidity: {weather.humidity}% • Rainfall: {weather.rainfall}mm
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-primary-green text-center mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/farms')}
            className="p-6 bg-gradient-to-br from-gray-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-green hover:shadow-md transition-all duration-200 flex flex-col items-center space-y-3 text-natural-brown hover:text-primary-green"
          >
            <Sprout size={32} />
            <span className="font-semibold">Manage Farms</span>
          </button>
          <button 
            onClick={() => navigate('/crops')}
            className="p-6 bg-gradient-to-br from-gray-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-green hover:shadow-md transition-all duration-200 flex flex-col items-center space-y-3 text-natural-brown hover:text-primary-green"
          >
            <TrendingUp size={32} />
            <span className="font-semibold">Crop Advice</span>
          </button>
          <button 
            onClick={() => navigate('/farms')}
            className="p-6 bg-gradient-to-br from-gray-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-green hover:shadow-md transition-all duration-200 flex flex-col items-center space-y-3 text-natural-brown hover:text-primary-green"
          >
            <Plus size={32} />
            <span className="font-semibold">Add New Farm</span>
          </button>
        </div>
      </div>

      {/* Recent Farms */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary-green text-center mb-6">Your Farms</h2>
        {farms.length === 0 ? (
          <div className="text-center py-12">
            <Sprout size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-primary-green mb-2">No farms yet</h3>
            <p className="text-natural-brown mb-6">Add your first farm to get started with crop recommendations</p>
            <button 
              onClick={() => navigate('/farms')}
              className="bg-gradient-to-r from-primary-green to-primary-light text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus size={20} />
              <span>Add Your First Farm</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.slice(0, 3).map((farm) => (
              <div 
                key={farm._id} 
                className="p-6 border border-gray-200 rounded-lg hover:border-primary-green hover:shadow-md transition-all duration-200 bg-gradient-to-br from-gray-50 to-green-50"
              >
                <h4 className="font-semibold text-primary-green text-lg mb-2">{farm.farmName}</h4>
                <p className="text-natural-brown text-sm mb-3">{farm.location}</p>
                {farm.cropType && (
                  <span className="inline-block bg-primary-green text-white px-3 py-1 rounded-full text-xs font-medium mb-3">
                    {farm.cropType}
                  </span>
                )}
                <div className="text-natural-brown text-sm font-medium">
                  {farm.size?.value} {farm.size?.unit}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;