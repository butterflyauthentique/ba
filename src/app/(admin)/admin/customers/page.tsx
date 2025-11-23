'use client';

import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, DollarSign, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface Customer {
    id: string;
    name: string | null;
    primaryEmail: string | null;
    emails: string[];
    phones: string[];
    totalOrders: number;
    totalSpent: number;
    firstOrderAt: any;
    lastOrderAt: any;
    createdAt: any;
    updatedAt: any;
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('lastOrderAt');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const customersRef = collection(db, 'customers');
            const q = query(customersRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            const customersData: Customer[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data() as Customer;
                customersData.push({
                    ...data,
                    id: doc.id
                });
            });

            setCustomers(customersData);
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer => {
        const name = (customer.name || '').toLowerCase();
        const email = (customer.primaryEmail || '').toLowerCase();
        const phone = (customer.phones?.[0] || '').toLowerCase();
        const search = searchTerm.toLowerCase();

        return name.includes(search) || email.includes(search) || phone.includes(search);
    });

    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return (a.name || '').localeCompare(b.name || '');
            case 'totalOrders':
                return (b.totalOrders || 0) - (a.totalOrders || 0);
            case 'totalSpent':
                return (b.totalSpent || 0) - (a.totalSpent || 0);
            case 'lastOrderAt':
            default:
                const aDate = a.lastOrderAt?.toDate?.() || new Date(0);
                const bDate = b.lastOrderAt?.toDate?.() || new Date(0);
                return bDate.getTime() - aDate.getTime();
        }
    });

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const totalOrders = customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex-1 lg:ml-64">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="font-secondary text-3xl font-bold text-gray-900">
                                Customers
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Manage customer relationships and track purchase history ({totalCustomers} total)
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                                    <p className="text-2xl font-semibold text-gray-900">{totalCustomers}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                    <p className="text-2xl font-semibold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <ShoppingBag className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                                    <p className="text-2xl font-semibold text-gray-900">₹{avgOrderValue.toFixed(0)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="lastOrderAt">Last Order Date</option>
                                <option value="name">Name</option>
                                <option value="totalOrders">Total Orders</option>
                                <option value="totalSpent">Total Spent</option>
                            </select>
                        </div>
                    </div>

                    {/* Customers Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading customers...</p>
                            </div>
                        ) : sortedCustomers.length === 0 ? (
                            <div className="p-8 text-center">
                                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                                <p className="text-gray-600">
                                    {searchTerm
                                        ? 'Try adjusting your search'
                                        : 'Customers will appear here when they place orders'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Orders
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Spent
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                First Order
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Last Order
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sortedCustomers.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                                                            <span className="text-red-600 font-semibold text-sm">
                                                                {(customer.name || 'U')[0].toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {customer.name || 'Unknown'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        <div className="flex items-center mb-1">
                                                            <Mail className="h-3 w-3 text-gray-400 mr-1" />
                                                            <span className="text-xs">{customer.primaryEmail || 'N/A'}</span>
                                                        </div>
                                                        {customer.phones && customer.phones.length > 0 && (
                                                            <div className="flex items-center">
                                                                <Phone className="h-3 w-3 text-gray-400 mr-1" />
                                                                <span className="text-xs">{customer.phones[0]}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <ShoppingBag className="h-4 w-4 text-gray-400 mr-2" />
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {customer.totalOrders || 0}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        ₹{(customer.totalSpent || 0).toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        {formatDate(customer.firstOrderAt)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        {formatDate(customer.lastOrderAt)}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
