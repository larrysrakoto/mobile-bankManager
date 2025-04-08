import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons'; // Import des icônes

export default function HomeScreen() {
  const [data, setData] = useState([
    { id: '1', name: 'Elon Musk', account: '123456789', balance: '1000€' },
    { id: '2', name: 'Jeff Bezos', account: '987654321', balance: '2500€' },
    { id: '3', name: 'Bill Gates', account: '456789123', balance: '500€' },
    { id: '4', name: 'Warren Buffet', account: '789123456', balance: '6000€' },
  ]);

  const [filteredData, setFilteredData] = useState(data);
  const [filter, setFilter] = useState('tout');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newBalance, setNewBalance] = useState('');

  const handleAdd = () => {
    setIsEditing(false);
    setNewName('');
    setNewBalance('');
    setModalVisible(true);
  };

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);
    if (itemToEdit) {
      setIsEditing(true);
      setSelectedItemId(id);
      setNewName(itemToEdit.name);
      setNewBalance(itemToEdit.balance.replace('€', '')); // Retirer le symbole € pour l'édition
      setModalVisible(true);
    }
  };

  const handleSave = () => {
    if (isEditing) {
      // Modifier l'élément existant
      setData((prevData) =>
        prevData.map((item) =>
          item.id === selectedItemId
            ? { ...item, name: newName, balance: `${newBalance}€` }
            : item
        )
      );
    } else {
      // Ajouter un nouvel élément
      const newItem = {
        id: (data.length + 1).toString(),
        name: newName,
        account: Math.floor(Math.random() * 1000000000).toString(), // Génère un numéro de compte aléatoire
        balance: `${newBalance}€`,
      };
      setData([...data, newItem]);
    }
    setModalVisible(false);
    setNewName('');
    setNewBalance('');
    setSelectedItemId(null);
    applyFilter(filter); // Réappliquer le filtre après ajout ou modification
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
    applyFilter(filter); // Réappliquer le filtre après suppression
  };

  const applyFilter = (selectedFilter) => {
    setFilter(selectedFilter);
    if (selectedFilter === 'tout') {
      setFilteredData(data);
    } else if (selectedFilter === 'insuffisant') {
      setFilteredData(data.filter((item) => parseFloat(item.balance.replace('€', '')) < 1000));
    } else if (selectedFilter === 'moyen') {
      setFilteredData(
        data.filter(
          (item) =>
            parseFloat(item.balance.replace('€', '')) >= 1000 &&
            parseFloat(item.balance.replace('€', '')) <= 5000
        )
      );
    } else if (selectedFilter === 'élevé') {
      setFilteredData(data.filter((item) => parseFloat(item.balance.replace('€', '')) > 5000));
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.account}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.balance}</Text>
      <View style={styles.cellActions}>
        <TouchableOpacity onPress={() => handleEdit(item.id)} style={styles.iconButton}>
          <FontAwesome name="edit" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
          <FontAwesome name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.up}>
        <ThemedText style={styles.headTitle}>Bienvenu dans votre banque!</ThemedText>
      </View>
      <View style={styles.down}>
        <View style={styles.actions}>
          <Button title="Ajouter" onPress={handleAdd} />
          <Picker
            selectedValue={filter}
            style={styles.dropdown}
            onValueChange={(itemValue) => applyFilter(itemValue)}
          >
            <Picker.Item label="Tout" value="tout" />
            <Picker.Item label="Insuffisant (< 1000€)" value="insuffisant" />
            <Picker.Item label="Moyen (1000€ - 5000€)" value="moyen" />
            <Picker.Item label="Élevé (> 5000€)" value="élevé" />
          </Picker>
        </View>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Num Compte</Text>
          <Text style={styles.headerCell}>Nom</Text>
          <Text style={styles.headerCell}>Solde</Text>
          <Text style={styles.headerCell}>Action</Text>
        </View>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.table}
        />
      </View>

      {/* Modal pour ajouter ou modifier un élément */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <FontAwesome name="close" size={24} color="#015B94" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Modifier un élément' : 'Ajouter un nouvel élément'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Solde"
              value={newBalance}
              onChangeText={setNewBalance}
              keyboardType="numeric"
            />
            <Button title="Enregistrer" onPress={handleSave} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  headTitle: {
    fontSize: 28,
    color: '#fff',
  },
  up: {
    flex: 1,
    backgroundColor: '#015B94',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  down: {
    flex: 3,
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    gap: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdown: {
    width: 250,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'red',
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#015B94',
    backgroundColor: '#E6F7FF',
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#015B94',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  cellActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconButton: {
    padding: 5,
    backgroundColor: '#015B94',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#015B94',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
