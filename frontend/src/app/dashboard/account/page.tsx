
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/data";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface UserProfile {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    profile_picture: string;
    phone_number: string;
    date_of_birth: string | null;
    address: string;
}

export default function AccountPage() {
    const { toast } = useToast();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    const fetchUserProfile = async () => {
        setIsLoading(true);
        const tokens = localStorage.getItem('tokens');
        if (!tokens) {
            toast({ variant: 'destructive', title: 'Authentication Error' });
            setIsLoading(false);
            return;
        }
        const { access } = JSON.parse(tokens);

        try {
            const response = await fetch(`${API_BASE_URL}/api/accounts/profile/`, {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                toast({ variant: 'destructive', title: 'Failed to fetch profile' });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'An error occurred while fetching your profile.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async () => {
        if (!user) return;
        setIsUpdatingProfile(true);

        const tokens = localStorage.getItem('tokens');
        if (!tokens) {
            toast({ variant: 'destructive', title: 'Authentication Error' });
            setIsUpdatingProfile(false);
            return;
        }
        const { access } = JSON.parse(tokens);
        
        const formData = new FormData();
        Object.entries(user).forEach(([key, value]) => {
            if (key !== 'profile_picture' && value !== null) {
                formData.append(key, value as string);
            }
        });
        if (profilePictureFile) {
            formData.append('profile_picture', profilePictureFile);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/accounts/profile/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${access}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                const updatedUser = data.user;
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                window.dispatchEvent(new Event('storage'));
                toast({ title: 'Profile Updated Successfully' });
                setProfilePictureFile(null); // Reset file input
            } else {
                 const errorData = await response.json();
                 const errorMessage = Object.values(errorData).flat().join(' ');
                toast({ variant: 'destructive', title: 'Failed to update profile', description: errorMessage });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'An error occurred while updating your profile.' });
        } finally {
            setIsUpdatingProfile(false);
        }
    };
    
    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast({ variant: 'destructive', title: 'Passwords do not match' });
            return;
        }
        setIsUpdatingPassword(true);

        const tokens = localStorage.getItem('tokens');
        if (!tokens) {
            toast({ variant: 'destructive', title: 'Authentication Error' });
            setIsUpdatingPassword(false);
            return;
        }
        const { access } = JSON.parse(tokens);

        try {
            const response = await fetch(`${API_BASE_URL}/api/accounts/change-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`
                },
                body: JSON.stringify({
                    old_password: currentPassword,
                    password: newPassword,
                    password2: confirmPassword
                })
            });
            
            const responseData = await response.json();

            if (response.ok) {
                toast({ title: 'Password Updated Successfully' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const errorMessage = Object.values(responseData).flat().join(' ');
                toast({ variant: 'destructive', title: 'Failed to update password', description: errorMessage });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'An error occurred while updating your password.' });
        } finally {
            setIsUpdatingPassword(false);
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (user) {
            setUser({ ...user, [e.target.id]: e.target.value });
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePictureFile(e.target.files[0]);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <p>Could not load user profile.</p>;
    }
    
    const getInitials = (firstName: string, lastName: string) => {
        const first = firstName ? firstName.charAt(0).toUpperCase() : '';
        const last = lastName ? lastName.charAt(0).toUpperCase() : '';
        return `${first}${last}`;
    }


    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user.profile_picture} alt={`${user.first_name} ${user.last_name}`} />
                    <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl font-bold font-headline capitalize">{user.first_name} {user.last_name}</h1>
                    <p className="text-muted-foreground">
                        Manage your personal information and preferences.
                    </p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your profile details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="profile_picture">Profile Picture</Label>
                        <Input id="profile_picture" type="file" onChange={handleFileChange} />
                        {profilePictureFile && <p className="text-sm text-muted-foreground">New file selected: {profilePictureFile.name}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input id="first_name" value={user.first_name} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input id="last_name" value={user.last_name} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={user.email} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" value={user.username} onChange={handleInputChange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone_number">Phone Number</Label>
                            <Input id="phone_number" value={user.phone_number || ''} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date_of_birth">Date of Birth</Label>
                            <Input id="date_of_birth" type="date" value={user.date_of_birth || ''} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea id="address" value={user.address || ''} onChange={handleInputChange} />
                    </div>
                     <Button onClick={handleUpdateProfile} disabled={isUpdatingProfile}>
                        {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                     </Button>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>For security, please choose a strong password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword}>
                        {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

