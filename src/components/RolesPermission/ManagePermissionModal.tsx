import { useState, useEffect } from 'react';
import { roleService } from '@/services';

interface PermissionActions {
    create: boolean;
    view: boolean;
    edit: boolean;
    delete: boolean;
}

interface Subsection {
    name: string;
    actions: PermissionActions;
}

interface Permission {
    name: string;
    description: string;
    actions?: PermissionActions;
    selectAll?: boolean;
    subsections?: Subsection[];
}

interface ManagePermissionModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    roleName?: string;
    roleDescription?: string;
    roleId?: string;
    onClose: () => void;
    onSave: (data: {
        roleName: string;
        roleDescription: string;
        permissions: Permission[];
    }) => Promise<void>;
    isLoading?: boolean;
}

export default function ManagePermissionModal({
    isOpen,
    mode,
    roleName: initialRoleName = '',
    roleDescription: initialRoleDescription = '',
    roleId,
    onClose,
    onSave,
    isLoading = false,
}: ManagePermissionModalProps) {
    const [roleName, setRoleName] = useState(initialRoleName);
    const [roleDescription, setRoleDescription] = useState(initialRoleDescription);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        Doctors: true,
    });

    const [permissions, setPermissions] = useState<Permission[]>([
        {
            name: 'Doctors',
            description: 'Permission settings for doctors',
            actions: { create: false, view: false, edit: false, delete: false },
        },
        {
            name: 'Our Team',
            description: 'Permission settings for team',
            actions: { create: false, view: false, edit: false, delete: false },
            selectAll: false,
        },
        {
            name: 'Services',
            description: 'Permission settings for services',
            actions: { create: false, view: false, edit: false, delete: false },
            selectAll: false,
        },
        {
            name: 'Blog & Articles',
            description: 'Permission settings for dashboard',
            actions: { create: false, view: false, edit: false, delete: false },
            selectAll: false,
        },
        {
            name: 'Admin Management',
            description: 'Permission settings for dashboard',
            actions: { create: false, view: false, edit: false, delete: false },
            selectAll: false,
        },
        {
            name: 'Roles and Permission',
            description: 'Permission settings for dashboard',
            actions: { create: false, view: false, edit: false, delete: false },
            selectAll: false,
        },
    ]);

    // Load role data when in edit mode
    useEffect(() => {
        if (mode === 'edit' && roleId && isOpen) {
            loadRoleData();
        }
    }, [mode, roleId, isOpen]);

    const loadRoleData = async () => {
        if (!roleId) return;
        setIsLoadingData(true);
        try {
            const response = await roleService.getRoleById(roleId);
            const roleData = response?.data?.data;

            if (roleData) {
                setRoleName(roleData.name);
                setRoleDescription(roleData.description || '');

                // Map the API permissions to the form structure
                if (roleData.permission?.resources) {
                    const mappedPermissions = permissions.map((perm) => {
                        // Map permission names to API keys
                        const resourceMapping: Record<string, string> = {
                            'Doctors': 'Doctor',
                            'Our Team': 'Team',
                            'Services': 'Service',
                            'Blog & Articles': 'Article',
                            'Admin Management': 'User',
                            'Roles and Permission': 'Roles_and_Permission',
                        };

                        const apiKey = resourceMapping[perm.name];
                        const apiPermissions = roleData.permission?.resources?.[apiKey] as PermissionActions | undefined;

                        return {
                            ...perm,
                            actions: (apiPermissions || perm.actions) as PermissionActions,
                        };
                    });

                    setPermissions(mappedPermissions);
                }
            }
        } catch (error: any) {
            // Log permission errors but don't show in modal - let user know visually
            if (error.response?.status === 403) {
                // Access denied to load role data
            } else if (error.response?.status === 401) {
                // Session expired while loading role data
            }
        } finally {
            setIsLoadingData(false);
        }
    };

    const toggleSection = (sectionName: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionName]: !prev[sectionName],
        }));
    };

    if (!isOpen) return null;

    const handleToggleAction = (permIndex: number, action: 'create' | 'view' | 'edit' | 'delete') => {
        setPermissions((prev) =>
            prev.map((perm, idx) => {
                if (idx === permIndex && perm.actions) {
                    return {
                        ...perm,
                        actions: {
                            ...perm.actions,
                            [action]: !perm.actions[action],
                        },
                    };
                }
                return perm;
            })
        );
    };

    const handleSave = async () => {
        try {
            await onSave({
                roleName,
                roleDescription,
                permissions,
            });
        } catch (error) {
            // Error handling is done in parent component
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[14px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 lg:px-[40px] flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#010101]">
                        {mode === 'create' ? 'Create' : 'Manage'} Roles & Permission
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-[40px] space-y-6">
                    {/* Role Details Section */}
                    <div className='border border-[#0101011A] p-[16px] rounded-[10px] lg:p-[20px]'>
                        <h3 className="text-sm font-semibold lg:text-[16px] text-[#010101] mb-4 lg:mb-[30px]">
                            Role Details
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-[30px]">
                            <div>
                                <label className="block text-xs lg:text-[14px] font-normal text-[#010101] mb-2">
                                    Role Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Super Admin"
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                    className="w-full px-4 py-[10px] border border-gray-300 rounded-[6px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0C2141]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs lg:text-[14px] font-normal text-[#010101] mb-2">
                                    Role Description
                                </label>
                                <textarea
                                    placeholder="Gold Model"
                                    value={roleDescription}
                                    onChange={(e) => setRoleDescription(e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-[6px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0C2141] resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Permissions Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-[#010101] mb-4 lg:text-[16px] lg:leading-[20px]">
                            Permissions
                        </h3>
                        <div className="space-y-0 border border-gray-300 rounded-[10px] overflow-hidden">
                            {permissions.map((permission, permIndex) => {
                                const isExpanded = expandedSections[permission.name] || false;

                                return (
                                    <div
                                        key={permIndex}
                                        className="bg-[#FFFFFF] "
                                    >
                                        {/* Accordion Header */}
                                        <button
                                            onClick={() => toggleSection(permission.name)}
                                            className="w-full px-4 py-3 flex items-center justify-between border-b  bg-[#141B340D] hover:bg-gray-50 transition"
                                        >
                                            <div className="text-left flex-1">
                                                <h4 className="text-sm lg:text-[13px] font-medium text-[#010101]">
                                                    {permission.name}
                                                </h4>
                                                <p className="text-xs lg:text-[12px] text-gray-500 mt-1">
                                                    {permission.description}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0 ml-4">
                                                <img src="/icon/circle-down.svg" alt="" className={` text-[#0C2141] transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
                                            </div>
                                        </button>

                                        {/* Accordion Content */}
                                        {isExpanded && permission.actions && (
                                            <div className="px-4 py-4 border-gray-200">
                                                {/* Main Permission Checkboxes */}
                                                <div className="flex items-center overflow-x-auto gap-6 mb-4">
                                                    {[ 'create', 'view', 'edit', 'delete'].map((action) => (
                                                        <label
                                                            key={action}
                                                            className="flex items-center cursor-pointer"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    permission.actions
                                                                        ? permission.actions[action as 'create' | 'view' | 'edit' | 'delete']
                                                                        : false
                                                                }
                                                                onChange={() =>
                                                                    handleToggleAction(permIndex, action as 'create' | 'view' | 'edit' | 'delete')
                                                                }
                                                                className="w-4 h-4 rounded border-gray-300"
                                                            />
                                                            <span className="ml-2 text-sm font-medium text-[#010101] capitalize">
                                                                {action}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading || isLoadingData}
                        className="px-6 py-2 rounded-full border border-red-500 text-red-500 font-medium text-sm hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading || isLoadingData}
                        className="px-6 py-2 rounded-full bg-[#0C2141] text-white font-medium text-sm hover:bg-[#0a1a31] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {mode === 'create' ? 'Creating...' : 'Updating...'}
                            </>
                        ) : isLoadingData ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Loading...
                            </>
                        ) : (
                            mode === 'create' ? 'Create' : 'Update'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
