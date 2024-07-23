import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../../services/userService';
import { User } from '../../interfaces/User';
import TableComponent from '../TableComponent/TableComponent';
import FilterComponent from '../FilterComponent/FilterComponent';
import styles from './AppContainer.module.css';

const AppContainer: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<{ gender?: string; nat?: string }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      const fetchedUsers = await fetchUsers(filters);
      setUsers(fetchedUsers);
    };
    getUsers();
  }, [filters]);

  const handleFilterChange = (newFilters: { gender?: string; nat?: string }) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteClick = () => {
    if (selectedUserIds.length > 0) {
      setShowModal(true);
    }
  };

  const handleEditClick = () => {
    if (selectedUserIds.length === 1) {
      const userToEdit = users.find(user => user.login.uuid === selectedUserIds[0]) || null;
      setEditUser(userToEdit);
      setShowEditModal(true);
    }
  };

  const handleConfirmDelete = () => {
    handleDeleteUsers(selectedUserIds);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedUserIds([]);
  };

  const handleSaveEdit = () => {
    setUsers(users.map(user => (user.login.uuid === editUser?.login.uuid ? editUser : user)));
    setShowEditModal(false);
    setSelectedUserIds([]);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setSelectedUserIds([]);
  };

  const handleDeleteUsers = (userIds: string[]) => {
    setUsers(users.filter(user => !userIds.includes(user.login.uuid)));
    setSelectedUserIds([]);
    setShowModal(false);
  };

  const handleUserSelect = (userId: string, selected: boolean) => {
    if (selected) {
      setSelectedUserIds(prevIds => [...prevIds, userId]);
    } else {
      setSelectedUserIds(prevIds => prevIds.filter(id => id !== userId));
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editUser) {
      const { name, value } = e.target;
      const nameParts = name.split('.');

      setEditUser((prevUser) => {
        if (!prevUser) return prevUser;

        if (nameParts.length === 2) {
          const [field, subField] = nameParts;
          return {
            ...prevUser,
            [field]: {
              ...(prevUser[field as keyof User] as object),
              [subField]: value
            }
          };
        } else {
          return { ...prevUser, [name]: value };
        }
      });
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.name.first} ${user.name.last}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.App}>
      <div className={styles['header-container']}>
        <h1>Mi tabla</h1>
        <div className={styles['buttons-container']}>
          <button className={`${styles.button} ${styles.filters}`} onClick={toggleFilters}>
            <span role="img" aria-label="filters">🔧</span> Filtros
          </button>
          <button className={`${styles.button} ${styles.edit}`} onClick={handleEditClick} disabled={selectedUserIds.length !== 1}>
            <span role="img" aria-label="edit">✏️</span> Editar
          </button>
          <button className={`${styles.button} ${styles.delete}`} onClick={handleDeleteClick}>
            <span role="img" aria-label="delete">🗑️</span> Eliminar
          </button>
        </div>
        <div className={`${styles['filter-container']} ${showFilters ? styles.active : ''}`}>
          <FilterComponent onFilterChange={handleFilterChange} />
        </div>
        <div className={styles['search-container']}>
          <input 
            type="text" 
            placeholder="Buscar" 
            value={searchTerm}
            onChange={handleSearch} 
          />
          <button>
            <span role="img" aria-label="search">🔍</span>
          </button>
        </div>
      </div>
      <TableComponent users={filteredUsers} onUserSelect={handleUserSelect} />
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>¿Está seguro que desea eliminar los registros seleccionados?</p>
            <button onClick={handleConfirmDelete} className={styles.confirmButton}>Sí</button>
            <button onClick={handleCancelDelete} className={styles.cancelButton}>No</button>
          </div>
        </div>
      )}
      {showEditModal && editUser && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Editar</h2>
            <input type="text" name="name.first" value={editUser.name.first} onChange={handleEditInputChange} />
            <input type="text" name="name.last" value={editUser.name.last} onChange={handleEditInputChange} />
            <input type="text" name="email" value={editUser.email} onChange={handleEditInputChange} />
            <div className={styles.modalButtons}>
              <button onClick={handleSaveEdit} className={styles.confirmButton}>Guardar</button>
              <button onClick={handleCancelEdit} className={styles.cancelButton}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppContainer;
