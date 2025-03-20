
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Camera } from 'lucide-react';

interface ProfileData {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Clean up blob URL when component unmounts or when avatarUrl changes
  useEffect(() => {
    return () => {
      // Cleanup function to revoke the blob URL when component unmounts
      if (avatarUrl && avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFullName(data.full_name || '');
      setAvatarUrl(data.avatar_url);
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    setAvatarFile(file);
    
    // Safely create and handle the object URL
    try {
      // Revoke any previous object URL to prevent memory leaks
      if (avatarUrl && avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
      
      // Create a new object URL
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
    } catch (error) {
      console.error('Error creating preview URL:', error);
      // If blob URL creation fails, don't update the preview
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return avatarUrl;

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `avatar_${user.id}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
      
      const { error, data } = await supabase.storage
        .from('product-images')
        .upload(fileName, avatarFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error('Upload error details:', error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        variant: "destructive",
        title: "Error uploading avatar",
        description: error.message || "Failed to upload avatar",
      });
      return null;
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      // Upload avatar if changed
      let newAvatarUrl = avatarUrl;
      if (avatarFile) {
        newAvatarUrl = await uploadAvatar();
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(), // Fix: Convert Date to ISO string
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      fetchProfile();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user && !isLoading) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl font-serif font-medium text-espresso mb-8">My Account</h1>

          <div className="bg-white rounded-lg card-shadow overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-sand">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <User className="w-12 h-12 text-taupe" />
                      </div>
                    )}
                  </div>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-espresso hover:bg-clay text-white p-1.5 rounded-full cursor-pointer button-transition">
                    <Camera className="w-4 h-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <div>
                  <h2 className="text-xl font-medium text-espresso">{profile?.full_name || user?.email}</h2>
                  <p className="text-taupe">{user?.email}</p>
                </div>
              </div>

              <form onSubmit={updateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="full-name" className="block text-sm font-medium text-espresso">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-taupe" />
                    </div>
                    <Input
                      id="full-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-espresso">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-taupe" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                  <p className="text-xs text-taupe">Email cannot be changed</p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="submit" 
                    disabled={isUpdating} 
                    className="flex-1 bg-espresso hover:bg-clay"
                  >
                    {isUpdating ? 'Updating...' : 'Update Profile'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => signOut()} 
                    className="flex-1"
                  >
                    Sign Out
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
