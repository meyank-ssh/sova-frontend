"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Building, CreditCard, User, Shield } from "lucide-react";
import AuthorizedLayout from "@/app/(authorized)/AuthorizedLayout";
import { getProfile } from "@/lib/api";

interface Profile {
  ClientName: string;
  ClientId: string;
  EmailId: string;
  MobileNo: string;
  PAN: string;
  ResidentialAddress: string;
  OfficeAddress: string;
  ClientExchangeDetailsList: Record<string, {
    Enabled: boolean;
    ClientId: string;
    ParticipantCode?: string | null;
  }>;
  IsInvestorClient: boolean;
  IsProClient: boolean;
  IsPOAEnabled: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        // Ensure response has correct structure
        if (response?.data?.result) {
          setProfile(response.data.result);
        } else {
          throw new Error("Invalid profile data format");
        }
      } catch (err) {
        setError("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
  }


  if (!profile) {
    return (
      <AuthorizedLayout>
        <div className="container mx-auto p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Profile Available</h3>
                <p className="text-gray-500">You currently don't have a profile set up.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AuthorizedLayout>
    );
  }

  return (
    <AuthorizedLayout> 
      <div className="container mx-auto p-6 space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Name", value: profile.ClientName, icon: <User className="h-4 w-4 opacity-70" /> },
                { label: "Client ID", value: profile.ClientId, icon: <CreditCard className="h-4 w-4 opacity-70" /> },
                { label: "Email", value: profile.EmailId, icon: <Mail className="h-4 w-4 opacity-70" /> },
                { label: "Mobile", value: profile.MobileNo, icon: <Phone className="h-4 w-4 opacity-70" /> },
                { label: "PAN", value: profile.PAN, icon: <Shield className="h-4 w-4 opacity-70" /> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center space-x-2">
                  {icon}
                  <span className="text-muted-foreground">{label}:</span>
                  <span>{value || "N/A"}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {[
                { label: "Residential Address", value: profile.ResidentialAddress, icon: <MapPin className="h-4 w-4 opacity-70 mt-1" /> },
                { label: "Office Address", value: profile.OfficeAddress, icon: <Building className="h-4 w-4 opacity-70 mt-1" /> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-start space-x-2">
                  {icon}
                  <div>
                    <span className="text-muted-foreground">{label}:</span>
                    <p>{value || "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exchange Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Exchange Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(profile.ClientExchangeDetailsList || {}).map(([exchange, details]) => (
                <Card key={exchange}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{exchange}</CardTitle>
                      <Badge variant={details.Enabled ? "default" : "secondary"}>
                        {details.Enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Client ID: </span>
                      {details.ClientId || "N/A"}
                    </div>
                    {details.ParticipantCode && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Participant Code: </span>
                        {details.ParticipantCode}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Investor", enabled: profile.IsInvestorClient },
                { label: "Pro", enabled: profile.IsProClient },
                { label: "POA Enabled", enabled: profile.IsPOAEnabled },
              ].map(({ label, enabled }) => (
                <div key={label} className="flex items-center space-x-2">
                  <Badge variant={enabled ? "default" : "secondary"}>{enabled ? label : `Non-${label}`}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthorizedLayout>
  );
}
