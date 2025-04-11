import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Button, Text, FlatList, TouchableOpacity, Modal, TextInput, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons'; // Import des icônes
import { deleteData, getData, saveData, updateData } from '@/utils';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import { BarChart } from 'react-native-chart-kit';

export default function HomeScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData()
      .then((fetchedData) => {
        setData(fetchedData);
        setFilteredData(fetchedData);
      }
      )
  }, []);

  const [filteredData, setFilteredData] = useState(data);
  const [filter, setFilter] = useState('tout');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [isChartModalVisible, setChartModalVisible] = useState(false);

  const handleAdd = () => {
    setIsEditing(false);
    setNewName('');
    setNewBalance('');
    setModalVisible(true);

  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setSelectedItemId(item.num);
    setNewName(item.nom);
    setNewBalance(item.sold.replace('€', ''));
    setModalVisible(true);
  };
  
  const handleSave = () => {
    if (isEditing && selectedItemId) {
      // Modifier l'élément existant
      updateData(selectedItemId, newName, `${newBalance}€`)
        .then((response) => {
          getData()
            .then((fetchedData) => {
              setData(fetchedData);
              setFilteredData(fetchedData);
            });
        })
        .catch((error) => {
          console.error('Erreur lors de la mise à jour des données :', error);
        });
    } else {
      // Ajouter un nouvel élément
      const newItem = {
        num: Math.floor(Math.random() * 1000000000).toString(),
        nom: newName,
        sold: `${newBalance}€`,
      };
      saveData(newItem.num, newItem.nom, newItem.sold)
        .then((response) => {
          getData()
            .then((fetchedData) => {
              setData(fetchedData);
              setFilteredData(fetchedData);
            });
        })
        .catch((error) => {
          console.error('Erreur lors de l\'ajout des données :', error);
        });
    }
    setModalVisible(false);
    setNewName('');
    setNewBalance('');
    setSelectedItemId(null);
  };

  const handleDelete = (num) => {
    deleteData(num)
      .then((response) => {
        getData()
            .then((fetchedData) => {
              setData(fetchedData);
              setFilteredData(fetchedData);
            }
            )
      }
      )
  };

  const applyFilter = (selectedFilter) => {
    setFilter(selectedFilter); // Met à jour l'état du filtre sélectionné
    if (selectedFilter === 'tout') {
      setFilteredData(data); // Affiche toutes les données
    } else if (selectedFilter === 'insuffisant') {
      setFilteredData(data.filter((item) => parseFloat(item.sold.replace('€', '')) < 1000)); // Solde < 1000
    } else if (selectedFilter === 'moyen') {
      setFilteredData(
        data.filter(
          (item) =>
            parseFloat(item.sold.replace('€', '')) >= 1000 &&
            parseFloat(item.sold.replace('€', '')) <= 5000 // Solde entre 1000 et 5000
        )
      );
    } else if (selectedFilter === 'élevé') {
      setFilteredData(data.filter((item) => parseFloat(item.sold.replace('€', '')) > 5000)); // Solde > 5000
    }
  };

  useEffect(() => {
    applyFilter(filter); // Réapplique le filtre chaque fois que les données changent
  }, [data]);

  const getMinMaxBalance = () => {
    if (filteredData.length === 0) {
      return { min: 0, max: 0, total: 0 };
    }

    const balances = filteredData.map((item) => parseFloat(item.sold.replace('€', '')));
    const min = Math.min(...balances);
    const max = Math.max(...balances);
    const total = balances.reduce((sum, value) => sum + value, 0); // Calcul du total

    return { min, max, total };
  };

  const { min, max, total } = getMinMaxBalance();

  const renderItem = ({ item }) => (
    <View style={styles.row} key={item.id}>
      <Text style={styles.cell}>{item.num}</Text>
      <Text style={styles.cell}>{item.nom}</Text>
      <Text style={styles.cell}>{item.sold}</Text>
      <View style={styles.cellActions}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconButton}>
          <FontAwesome name="edit" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.num)} style={styles.iconButton}>
          <FontAwesome name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const openChartModal = () => {
    setChartModalVisible(true);
  };

  const closeChartModal = () => {
    setChartModalVisible(false);
  };

  const chartData = {
    labels: filteredData.map((item) => item.nom), // Noms des clients
    datasets: [
      {
        data: filteredData.map((item) => parseFloat(item.sold.replace('€', ''))), // Soldes des clients
      },
    ],
  };

  const minMaxColors = filteredData.map((item) => {
    const value = parseFloat(item.sold.replace('€', ''));
    if (value === min) {
      return '#FF0000'; // Rouge pour le minimum
    } else if (value === max) {
      return '#00FF00'; // Vert pour le maximum
    }
    return '#015B94'; // Bleu pour les autres
  });

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
        <View style={styles.balanceSummary}>
          <Text style={styles.balanceText}>Solde Minimal : {min}€</Text>
          <Text style={styles.balanceText}>Solde Maximal : {max}€</Text>
          <Text style={styles.balanceText}>Total des Soldes : {total}€</Text>
        </View>
        <Button title="Visualiser Histogramme" onPress={openChartModal} />
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
              value={newName} // Affiche la valeur actuelle
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Solde"
              value={newBalance} // Affiche la valeur actuelle
              onChangeText={setNewBalance}
              keyboardType="numeric"
            />
            <Button title="Enregistrer" onPress={handleSave} />
          </View>
        </View>
      </Modal>

      {/* Modal pour afficher l'histogramme */}
      <Modal visible={isChartModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeChartModal} style={styles.closeButton}>
              <FontAwesome name="close" size={24} color="#015B94" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Histogramme des Soldes</Text>
            {filteredData?.length > 0 ? (
              <BarChart
                data={chartData}
                width={Dimensions.get('window').width - 40}
                height={220}
                yAxisLabel="€"
                chartConfig={{
                  backgroundColor: '#015B94',
                  backgroundGradientFrom: '#015B94',
                  backgroundGradientTo: '#81D4FA',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                verticalLabelRotation={30}
              />
            ) : (
              <Text>Aucune donnée disponible pour l'histogramme.</Text>
            )}
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
    width: '90%',
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
  balanceSummary: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#E6F7FF',
    borderRadius: 10,
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#015B94',
  },
});
