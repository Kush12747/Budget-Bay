import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { 
    getUserById, 
    getUserAddress,
    getUserProducts, 
    getUserBids, 
    getWonAuctions,
    createUserAddress,
    updateUserAddress,
    uploadProfilePicture
} from '../../services/apiClient';
import styles from './DashboardPage.module.css';

import UserProfile from '../../components/dashboard/UserProfile';
import UserAddress from '../../components/dashboard/UserAddress';
import UserListings from '../../components/dashboard/UserListings';
import UserBids from '../../components/dashboard/UserBids';
import WonAuctions from '../../components/dashboard/WonAuctions';


const initialAddressState = {
    streetNumber: '',
    streetName: '',
    aptNumber: '',
    city: '',
    state: '',
    zipCode: '',
};

const DashboardPage = () => {
    const { user, token } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState(null);
    const [products, setProducts] = useState([]);
    const [bids, setBids] = useState([]);
    const [wonAuctions, setWonAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState(initialAddressState);
    const [addressError, setAddressError] = useState('');

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');


    const fetchDashboardData = useCallback(async () => {
        if (user && token) {
            const userId = user.sub;
            try {
                if (!userInfo) setLoading(true); 
                
                const userData = await getUserById(userId, token);
                let addressData = null;
                try {
                    addressData = await getUserAddress(userId, token);
                } catch (e) {
                    if (e.message.toLowerCase().includes('404') || e.message.toLowerCase().includes('not found')) {
                         console.log("User does not have an address yet. The UI will prompt them to add one.");
                    } else {
                        throw e;
                    }
                }

                const [productsData, bidsData, wonAuctionsData] = await Promise.all([
                    getUserProducts(userId, token),
                    getUserBids(userId, token),
                    getWonAuctions(userId, token)
                ]);

                setUserInfo({ ...userData, address: addressData });
                setProducts(productsData);
                console.log(productsData);
                setBids(bidsData);
                setWonAuctions(wonAuctionsData);

                setAddressForm(addressData || initialAddressState);

            } catch (err) {
                setError(err.message || 'Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        }
    }, [user, token, userInfo]);
    
    useEffect(() => {
        fetchDashboardData();
    }, [user, token]);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setAddressError('');
        const userId = user.sub;
        
        try {
            if (userInfo.address) {
                await updateUserAddress(userId, addressForm, token);
            } else {
                await createUserAddress(userId, addressForm, token);
            }
            setIsEditingAddress(false);
            await fetchDashboardData(); 
        } catch (err) {
            setAddressError(err.message || "Failed to save address.");
        }
    };

    const handleEditAddress = () => {
        setAddressForm(userInfo?.address || initialAddressState);
        setIsEditingAddress(true);
    };

    const handleCancelEdit = () => {
        setIsEditingAddress(false);
        setAddressError('');
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        setIsUploading(true);
        setUploadError('');
    
        try {
            await uploadProfilePicture(user.sub, file, token);
            await fetchDashboardData(); // Re-fetch all data to get the new URL
        } catch (err) {
            setUploadError(err.message || 'Failed to upload profile picture.');
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) { 
        return <main><div className={styles.messageContainer}>Loading Dashboard...</div></main>
    } 

    if (error) {
        return <main><div className={styles.messageContainer}>Error: {error}</div></main>;
    }

    return (
        <main>
        <div className={styles.dashboardContainer}>
            <header className={styles.dashboardHeader}>
                <h1 className={styles.welcomeMessage}>Welcome, {userInfo?.username || 'User'}!</h1>
                <p>Manage your account, listings, and bids all in one place.</p>
            </header>

            <div className={styles.topGrid}>
                <UserProfile 
                    userInfo={userInfo}
                    onFileChange={handleProfilePictureChange}
                    isUploading={isUploading}
                    uploadError={uploadError}
                />
                <UserAddress 
                    userInfo={userInfo}
                    isEditing={isEditingAddress}
                    addressForm={addressForm}
                    error={addressError}
                    onEdit={handleEditAddress}
                    onCancel={handleCancelEdit}
                    onChange={handleAddressChange}
                    onSubmit={handleAddressSubmit}
                />
            </div>

            <UserListings listings={products} />
            <UserBids bids={bids} />
            <WonAuctions auctions={wonAuctions} />
        </div>
        </main>
    );
}

export default DashboardPage;