import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

interface Settings {
  companyName: string;
  companyNameArabic: string;
  trnNumber: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  companyWebsite: string;
  vatRate: number;
}

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    companyName: 'Fusion Star General Transport L.L.C - O.P.C',
    companyNameArabic: 'فيوشن ستار للنقليات العامة - ذ.م.م - ش.و.و',
    trnNumber: '',
    companyPhone: '+971529747360',
    companyEmail: 'info@fusionstargeneraltransport.ae',
    companyAddress: 'Al Sarab Commercial Center Office No. 21, M-14 Musaffah Industrial Area, Abu Dhabi, UAE',
    companyWebsite: 'www.fusionstargeneraltransport.ae',
    vatRate: 5.00,
  });

  const [saved, setSaved] = useState(false);

  // Load settings from API on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/settings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setSettings({
            companyName: data.company_name,
            companyNameArabic: data.company_name_arabic || '',
            trnNumber: data.trn_number,
            companyPhone: data.phone,
            companyEmail: data.email,
            companyAddress: data.address,
            companyWebsite: data.website || '',
            vatRate: data.vat_rate,
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      // Save to database
      const response = await fetch('http://localhost:3001/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          company_name: settings.companyName,
          company_name_arabic: settings.companyNameArabic,
          trn_number: settings.trnNumber,
          address: settings.companyAddress,
          phone: settings.companyPhone,
          email: settings.companyEmail,
          website: settings.companyWebsite,
          vat_rate: settings.vatRate,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save settings');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      alert(error.message || 'Failed to save settings');
    }
  };

  const handleReset = () => {
    if (confirm('Reset all settings to default values?')) {
      const defaultSettings: Settings = {
        companyName: 'Fusion Star General Transport L.L.C - O.P.C',
        companyNameArabic: 'فيوشن ستار للنقليات العامة - ذ.م.م - ش.و.و',
        trnNumber: '',
        companyPhone: '+971529747360',
        companyEmail: 'info@fusionstargeneraltransport.ae',
        companyAddress: 'Al Sarab Commercial Center Office No. 21, M-14 Musaffah Industrial Area, Abu Dhabi, UAE',
        companyWebsite: 'www.fusionstargeneraltransport.ae',
        vatRate: 5.00,
      };
      setSettings(defaultSettings);
      handleSave();
    }
  };

  return (
    <Layout title="Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Message */}
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            ✅ Settings saved successfully!
          </div>
        )}

        {/* Company Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Company Information</h2>
          <p className="text-gray-600 mb-6 text-sm">
            This information will appear on all your PDF invoices
          </p>

          <div className="space-y-4">
            <Input
              label="Company Name (English) *"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              placeholder="Fusion Star General Transport L.L.C - O.P.C"
            />

            <Input
              label="Company Name (Arabic)"
              value={settings.companyNameArabic}
              onChange={(e) => setSettings({ ...settings, companyNameArabic: e.target.value })}
              placeholder="فيوشن ستار للنقليات العامة"
              dir="rtl"
            />

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-800 mb-2">⚠️ UAE VAT Compliance Required</p>
              <Input
                label="TRN (Tax Registration Number) *"
                value={settings.trnNumber}
                onChange={(e) => setSettings({ ...settings, trnNumber: e.target.value })}
                placeholder="15 digits (e.g., 100000000000000)"
                maxLength={15}
              />
              <p className="text-xs text-yellow-700 mt-1">
                This is mandatory for UAE VAT compliance. Your TRN will appear on all invoices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                value={settings.companyPhone}
                onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />

              <Input
                label="Email Address"
                type="email"
                value={settings.companyEmail}
                onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                placeholder="info@yourcompany.com"
              />
            </div>

            <Input
              label="Business Address"
              value={settings.companyAddress}
              onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
              placeholder="123 Main Street, City, State, ZIP"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Website"
                value={settings.companyWebsite}
                onChange={(e) => setSettings({ ...settings, companyWebsite: e.target.value })}
                placeholder="www.yourcompany.com"
              />

              <Input
                label="VAT Rate (%)"
                type="number"
                value={settings.vatRate}
                onChange={(e) => setSettings({ ...settings, vatRate: parseFloat(e.target.value) || 5 })}
                placeholder="5.00"
                step="0.01"
                disabled
              />
            </div>

            <p className="text-xs text-gray-500">
              * VAT rate is fixed at 5% for UAE. This field is read-only.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button variant="secondary" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-sm">💡 Tips:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Settings are saved in database</li>
            <li>• Company information appears on all PDF invoices</li>
            <li>• TRN is mandatory for UAE VAT compliance</li>
            <li>• Click "Reset to Defaults" to restore original values</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}

// Export function to get settings from API
export async function getSettings(): Promise<Settings> {
  try {
    const response = await fetch('http://localhost:3001/api/settings', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        companyName: data.company_name,
        companyNameArabic: data.company_name_arabic || '',
        trnNumber: data.trn_number,
        companyPhone: data.phone,
        companyEmail: data.email,
        companyAddress: data.address,
        companyWebsite: data.website || '',
        vatRate: data.vat_rate,
      };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  
  // Return defaults if API fails
  return {
    companyName: 'Fusion Star General Transport L.L.C - O.P.C',
    companyNameArabic: 'فيوشن ستار للنقليات العامة - ذ.م.م - ش.و.و',
    trnNumber: '',
    companyPhone: '+971529747360',
    companyEmail: 'info@fusionstargeneraltransport.ae',
    companyAddress: 'Al Sarab Commercial Center Office No. 21, M-14 Musaffah Industrial Area, Abu Dhabi, UAE',
    companyWebsite: 'www.fusionstargeneraltransport.ae',
    vatRate: 5.00,
  };
}
